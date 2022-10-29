import { idAbStatus } from "../elementIds.constants";
import { STATE_PAUSED, STATE_STOPPED } from "../app.constants";
import { getBuyerSettings, getValue, setValue } from "../services/repository";
import { stopBotIfRequired } from "../utils/autoActionsUtil";
import { getRangeValue, playAudio } from "../utils/commonUtil";
import {
  sendNotificationToUser,
  sendPinEvents,
  sendUINotification,
} from "../utils/notificationUtil";

import { setRandomInterval } from "../utils/timeOutUtil";
import { addUserWatchItems } from "../utils/watchlistUtil";
import {
  getFunctionsWithContext,
  setInitialValues,
} from "../utils/processorUtil";
import { processSellQueue } from "../utils/sellUtil";

let interval = null;
let passInterval = null;

export const startAutoBuyer = async function (isResume) {
  $("#" + idAbStatus)
    .css("color", "#2cbe2d")
    .html("RUNNING");

  const isActive = getValue("autoBuyerActive");
  if (isActive) return;
  isResume && sendNotificationToUser("Autobuyer Started", true);
  setInitialValues(isResume);
  const {
    switchFilterWithContext,
    srchTmWithContext,
    watchListWithContext,
    transferListWithContext,
    pauseBotWithContext,
  } = getFunctionsWithContext.call(this);

  await switchFilterWithContext();
  let buyerSetting = getBuyerSettings();
  !isResume && (await addUserWatchItems());
  sendPinEvents("Hub - Transfers");
  await srchTmWithContext(buyerSetting);
  sendPinEvents("Hub - Transfers");
  await transferListWithContext(
    buyerSetting["idAbSellToggle"],
    buyerSetting["idAbMinDeleteCount"],
    true
  );
  let operationInProgress = false;
  if (getValue("autoBuyerActive")) {
    interval = setRandomInterval(async () => {
      passInterval = pauseBotWithContext(buyerSetting);
      stopBotIfRequired(buyerSetting);
      const isBuyerActive = getValue("autoBuyerActive");
      if (isBuyerActive && !operationInProgress) {
        operationInProgress = true;
        await processSellQueue();
        await switchFilterWithContext();
        buyerSetting = getBuyerSettings();
        sendPinEvents("Hub - Transfers");
        await srchTmWithContext(buyerSetting);
        sendPinEvents("Hub - Transfers");
        await watchListWithContext(buyerSetting);
        sendPinEvents("Hub - Transfers");
        await transferListWithContext(
          buyerSetting["idAbSellToggle"],
          buyerSetting["idAbMinDeleteCount"]
        );
      }
      operationInProgress = false;
    }, ...getRangeValue(buyerSetting["idAbWaitTime"]));
  }
};

export const stopAutoBuyer = (isPaused) => {
  interval && interval.clear();
  if (!isPaused && passInterval) {
    clearTimeout(passInterval);
  }
  const state = getValue("autoBuyerState");
  if (
    (isPaused && state === STATE_PAUSED) ||
    (!isPaused && state === STATE_STOPPED)
  ) {
    return;
  }
  setValue("autoBuyerActive", false);
  const searchSavedInterval = getValue("searchInterval") || {};
  setValue("searchInterval", {
    start: searchSavedInterval.start,
    end: Date.now(),
  });
  if (!isPaused) {
    playAudio("finish");
  }
  isPhone() && $(".ut-tab-bar-item").removeAttr("disabled");
  setValue("autoBuyerState", isPaused ? STATE_PAUSED : STATE_STOPPED);
  isPaused && sendNotificationToUser("Autobuyer Paused", isPaused);
  sendUINotification(isPaused ? "Autobuyer Paused" : "Autobuyer Stopped");
  if (!isPaused) {
    processSellQueue();
  }
  $("#" + idAbStatus)
    .css("color", "red")
    .html(isPaused ? "PAUSED" : "IDLE");
};

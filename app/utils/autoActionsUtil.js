import { idAutoBuyerFoundLog } from "../elementIds.constants";
import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import {
  getValue,
  increAndGetStoreValue,
  setValue,
} from "../services/repository";
import { convertToSeconds, getRandNum } from "./commonUtil";
import { writeToLog } from "./logUtil";
import { sendNotificationToUser } from "./notificationUtil";
import { loadFilter } from "./userExternalUtil";

export const stopBotIfRequired = (buyerSetting) => {
  const purchasedCardCount = getValue("purchasedCardCount");
  const cardsToBuy = buyerSetting["idAbCardCount"];

  const botStartTime = getValue("botStartTime").getTime();
  let time = convertToSeconds(buyerSetting["idAbStopAfter"]);
  let sendDetailedNotification = buyerSetting["idDetailedNotification"];
  let currentTime = new Date().getTime();
  let timeElapsed = (currentTime - botStartTime) / 1000;

  if (timeElapsed >= time || (cardsToBuy && purchasedCardCount >= cardsToBuy)) {
    if(sendDetailedNotification)
      sendNotificationToUser(`Autbuyer stopped | ${
        timeElapsed ? "Time elapsed" : "Max pruchases count reached"
      }`);
    stopAutoBuyer();
  }
};

export const pauseBotIfRequired = function (buyerSetting) {
  const isBuyerActive = getValue("autoBuyerActive");
  if (!isBuyerActive) return;
  const pauseFor = convertToSeconds(buyerSetting["idAbPauseFor"]) * 1000;
  const cycleAmount = buyerSetting["idAbCycleAmount"];
  const searchCount = getValue("sessionStats").searchCount;
  if (searchCount && !(searchCount % cycleAmount)) {
    stopAutoBuyer(true);
    return setTimeout(() => {
      startAutoBuyer.call(this, true);
    }, pauseFor);
  }
};

export const switchFilterIfRequired = async function () {
  const availableFilters = getValue("selectedFilters");
  const fiterSearchCount = getValue("fiterSearchCount");
  const currentFilterCount = getValue("currentFilterCount");
  let useSequential = getValue("useSequential");
  let currentMultiFilter = getValue("currentMultiFilter");
  if (
    !availableFilters ||
    !availableFilters.length ||
    fiterSearchCount > currentFilterCount
  ) {
    increAndGetStoreValue("currentFilterCount");
    return false;
  }
  setValue("currentFilterCount", 1);
  setValue("currentPage", 1);


  if ( useSequential ) {
    if ( currentMultiFilter < availableFilters.length - 1 ) {
      currentMultiFilter++;
    } else {
      currentMultiFilter = 0;
    }
  } else {
    currentMultiFilter = getRandNum(0, availableFilters.length - 1);

  }

  setValue("currentMultiFilter", currentMultiFilter);
  let filterName = availableFilters[currentMultiFilter];

  await loadFilter.call(this, filterName);
  writeToLog(
    `---------------------------  Running for filter ${filterName}  ---------------------------------------------`,
    idAutoBuyerFoundLog
  );
};

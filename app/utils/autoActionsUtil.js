import {
  idAutoBuyerFoundLog,
  idProgressAutobuyer,
} from "../elementIds.constants";
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
  let timeElapsed = (currentTime - botStartTime) / 1000 >= time;
  const isSelling = false;
  // buyerSetting["idSellCheckBuyPrice"] || buyerSetting["idSellFutBinPrice"];
  const isTransferListFull =
    isSelling &&
    repositories.Item &&
    repositories.Item.transfer.length >=
      repositories.Item.pileSizes._collection[5];

  if (
    isTransferListFull ||
    timeElapsed ||
    (cardsToBuy && purchasedCardCount >= cardsToBuy)
  ) {
    const message = timeElapsed
      ? "Time elapsed"
      : isTransferListFull
      ? "Transfer list is full"
      : "Max purchases count reached";

    if (sendDetailedNotification)
      sendNotificationToUser(`Autobuyer stopped | ${message}`);
    writeToLog(`Autobuyer stopped | ${message}`, idProgressAutobuyer);
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
  const currentFilterIndex = getValue("currentFilterIndex") || 0;
  let filterIndex = getValue("runSequentially")
    ? currentFilterIndex % availableFilters.length
    : getRandNum(0, availableFilters.length - 1);

  setValue("currentFilterIndex", filterIndex + 1);
  let filterName = availableFilters[filterIndex];
  await loadFilter.call(this, filterName);
  writeToLog(
    `---------------------------  Running for filter ${filterName}  ---------------------------------------------`,
    idAutoBuyerFoundLog
  );
};

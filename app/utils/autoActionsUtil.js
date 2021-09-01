import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { getValue } from "../services/repository";
import { convertToSeconds } from "./commonUtil";

export const stopBotIfRequired = (buyerSetting) => {
  const purchasedCardCount = getValue("purchasedCardCount");
  const cardsToBuy = buyerSetting["idAbCardCount"];

  const botStartTime = getValue("botStartTime").getTime();
  let time = convertToSeconds(buyerSetting["idAbStopAfter"]);
  let currentTime = new Date().getTime();
  let timeElapsed = (currentTime - botStartTime) / 1000;

  if (timeElapsed >= time || (cardsToBuy && purchasedCardCount >= cardsToBuy)) {
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

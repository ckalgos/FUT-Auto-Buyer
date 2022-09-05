import {
  idAbCoins,
  idAbProfit,
  idAbRequestCount,
  idAbCountDown,
  idAbSearchProgress,
  idAbStatisticsProgress,
  idAbSoldItems,
  idAbUnsoldItems,
  idAbAvailableItems,
  idAbActiveTransfers,
} from "../elementIds.constants";
import { getValue, setValue } from "../services/repository";
import { getTimerProgress } from "../utils/commonUtil";

setValue("sessionStats", {
  soldItems: "-",
  unsoldItems: "-",
  activeTransfers: "-",
  availableItems: "-",
  coins: "-",
  coinsNumber: 0,
  previousPause: 0,
  searchCount: 0,
  profit: 0,
  transactions: [],
});

export const statsProcessor = () => {
  setInterval(() => {
    isPhone() ? phoneStatsProcessor() : webStatsProcessor();
  }, 1000);
};

const phoneStatsProcessor = () => {
  const nextRefresh = getTimerProgress(getValue("searchInterval"));
  const currentStats = getValue("sessionStats");
  $("#" + idAbRequestCount).html(currentStats.searchCount);
  $("#" + idAbProfit).html(currentStats.profit);
  $("#" + idAbCoins).html(currentStats.coins);
  $("#" + idAbSearchProgress).css("width", nextRefresh);
  updateTimer();
};

const webStatsProcessor = () => {
  const nextRefresh = getTimerProgress(getValue("searchInterval"));
  const currentStats = getValue("sessionStats");
  $("#" + idAbSearchProgress).css("width", nextRefresh);
  $("#" + idAbStatisticsProgress).css("width", nextRefresh);

  $("#" + idAbCoins).html(currentStats.coins);
  $("#" + idAbRequestCount).html(currentStats.searchCount);
  $("#" + idAbSoldItems).html(currentStats.soldItems);
  $("#" + idAbUnsoldItems).html(currentStats.unsoldItems);
  $("#" + idAbAvailableItems).html(currentStats.availableItems);
  $("#" + idAbActiveTransfers).html(currentStats.activeTransfers);
  $("#" + idAbProfit).html(currentStats.profit);

  updateTimer();

  if (currentStats.unsoldItems) {
    $("#" + idAbUnsoldItems).css("color", "red");
  } else {
    $("#" + idAbUnsoldItems).css("color", "");
  }

  if (currentStats.availableItems) {
    $("#" + idAbAvailableItems).css("color", "orange");
  } else {
    $("#" + idAbAvailableItems).css("color", "");
  }
};

const updateTimer = () => {
  const startTime = getValue("botStartTime");
  if (startTime && getValue("autoBuyerActive")) {
    const diffInSeconds = Math.abs(new Date() - startTime) / 1000;
    const hrs = Math.floor((diffInSeconds / 60 / 60) % 24);
    const mins = Math.floor((diffInSeconds / 60) % 60);
    const secs = Math.floor(diffInSeconds % 60);
    const timeString =
      (hrs < 10 ? "0" : "") +
      hrs +
      ":" +
      (mins < 10 ? "0" : "") +
      mins +
      ":" +
      (secs < 10 ? "0" : "") +
      secs;
    $("#" + idAbCountDown).html(timeString);
    updateStats("runningTime", timeString);
  }
};

export const updateStats = (key, value) => {
  const currentStats = getValue("sessionStats");
  currentStats[key] = value;
  setValue("sessionStats", currentStats);
};

export const getStatsValue = (key) => {
  const currentStats = getValue("sessionStats");
  return currentStats[key] || 0;
};

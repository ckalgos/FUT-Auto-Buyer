import {
  idAbActiveTransfers,
  idAbAvailableItems,
  idAbCoins,
  idAbProfit,
  idAbRequestCount,
  idAbSearchProgress,
  idAbSoldItems,
  idAbStatisticsProgress,
  idAbUnsoldItems,
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
  searchCount: 0,
  profit: 0,
});

export const statsProcessor = () => {
  setInterval(() => {
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
  }, 1000);
};

export const updateStats = (key, value) => {
  const currentStats = getValue("sessionStats");
  currentStats[key] = value;
  setValue("sessionStats", currentStats);
};

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
import { sendMessageToDiscord } from "../services/discordService";
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
  previousPause: 0,
  profit: 0,
  sessionId: Date.now().toString(36) + Math.random().toString(36).substr(2),
});

export const statsProcessor = () => {
  exportStatsExternal();
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

export const exportStatsExternal = () => {
  const persona = services.User.getUser().getSelectedPersona();
  const club = persona.getCurrentClub();
  setInterval(async () => {
    const currentStats = getValue("sessionStats");
    const autoBuyerState = getValue("autoBuyerState");
    const availableFilters = getValue("filters") || {};
    const currentFilter = getValue("currentFilter");
    const lastErrorMessage = getValue("lastErrorMessage");
    const payload = {
      autoBuyerState,
      persona: persona.name,
      clublogo: club.assetId,
      availableFilters: Object.keys(availableFilters),
      currentFilter,
      lastErrorMessage,
      sessionId: currentStats.sessionId,
      searchCount: currentStats.searchCount,
      coinsNumber: currentStats.coinsNumber,
      profit: currentStats.profit,
      type: "statsUpdate",
    };
    await sendMessageToDiscord(JSON.stringify(payload));
  }, 3000);
};

export const updateStats = (key, value) => {
  const currentStats = getValue("sessionStats");
  currentStats[key] = value;
  setValue("sessionStats", currentStats);
};

import { idAbRequestCount } from "../elementIds.constants";
import { getValue, setValue } from "../services/repository";

setValue("sessionStats", {
  soldItems: "-",
  unsoldItems: "-",
  activeTransfers: "-",
  availableItems: "-",
  coins: "-",
  coinsNumber: 0,
  searchCount: 0,
});

export const statsProcessor = () => {
  const buyerSetting = getValue("BuyerSettings");
  setInterval(() => {
    const currentStats = getValue("sessionStats");
    jQuery("#" + idAbRequestCount).html(currentStats.searchCount);
  }, 1000);
};

export const updateStats = (key, value) => {
  const currentStats = getValue("sessionStats");
  currentStats[key] = value;
  setValue("sessionStats", currentStats);
};

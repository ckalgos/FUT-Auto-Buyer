import { getValue, setValue } from "../services/repository";

export const updateRequestCount = () => {
  const currentStats = getValue("sessionStats");
  currentStats["searchCount"]++;
  setValue("sessionStats", currentStats);
};

export const updateProfit = (val) => {
  const currentStats = getValue("sessionStats");
  currentStats["profit"] += val;
  setValue("sessionStats", currentStats);
};

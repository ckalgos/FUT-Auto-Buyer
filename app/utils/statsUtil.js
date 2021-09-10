import { getValue, setValue } from "../services/repository";

export const updateRequestCount = () => {
  const currentStats = getValue("sessionStats");
  currentStats["searchCount"]++;
  setValue("sessionStats", currentStats);
};

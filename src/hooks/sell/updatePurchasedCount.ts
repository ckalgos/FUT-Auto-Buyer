import { StatsFactory } from "../../factory/StatsFactory";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";

export const updatePurchasedCount = (_: UTItem) => {
  const statsProcessor = StatsFactory.getInstance().getProcessor();
  statsProcessor.incrementStat("purchasedCardCount");
};

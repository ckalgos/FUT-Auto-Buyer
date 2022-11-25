import { InMemoryStore } from "../../classes/InMemoryStore";
import { StatsFactory } from "../../factory/StatsFactory";

export const checkPurchasedCount = () => {
  const { purchasedCardCount } = StatsFactory.getInstance()
    .getProcessor()
    .getStats();
  const store = InMemoryStore.getInstance();
  const { noOfCards } = store.get("buy-setting");
  if (noOfCards && (purchasedCardCount || 0) >= noOfCards) {
    return "Max purchases count reached";
  }
};

import { InMemoryStore } from "../../classes/InMemoryStore";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";

export const buyPriceValidator = (_: UTSearchCriteria) => {
  const store = InMemoryStore.getInstance();
  const { buyPrice, bidPrice } = store.get("buy-setting");
  if (!buyPrice && !bidPrice) {
    return "No buy price/bid price given";
  }
  return null;
};

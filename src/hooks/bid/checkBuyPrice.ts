import { InMemoryStore } from "../../classes/InMemoryStore";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";

export const checkBuyPrice = (item: UTItem) => {
  const store = InMemoryStore.getInstance();
  const { buyPrice } = store.get("buy-setting");
  if (!buyPrice || item._auction.buyNowPrice <= buyPrice) {
    return null;
  }
  return "BIN is greater than user price";
};

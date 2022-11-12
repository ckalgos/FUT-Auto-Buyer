import { InMemoryStore } from "../../classes/InMemoryStore";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";

export const checkIfCached = (item: UTItem) => {
  const store = InMemoryStore.getInstance();
  const { cachedBids } = store.get("autobuyer-cache");
  if (cachedBids?.has(item._auction.tradeId)) {
    console.log("cachced");
    return "Cached Item";
  }
  return null;
};

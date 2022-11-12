import { InMemoryStore } from "../../classes/InMemoryStore";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";

export const addToCache = (item: UTItem) => {
  const store = InMemoryStore.getInstance();
  const { cachedBids } = store.get("autobuyer-cache");
  cachedBids?.add(item._auction.tradeId);
  return null;
};

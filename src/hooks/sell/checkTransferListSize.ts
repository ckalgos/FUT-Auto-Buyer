import { InMemoryStore } from "../../classes/InMemoryStore";
import { UTItemPile } from "../../types/enums/enums";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";

export const checkTransferListSize = (_: UTItem) => {
  const store = InMemoryStore.getInstance();
  const { sellPrice } = store.get("sell-setting");
  if (sellPrice && repositories.Item.isPileFull(UTItemPile.TRANSFER)) {
    return "Unable to list, transfer List if Full";
  }
  return null;
};

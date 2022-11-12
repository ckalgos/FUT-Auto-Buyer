import { UTItemPile } from "../../enums/enums";

export interface ItemRepository {
  setDirty(pile: UTItemPile): void;
  isPileFull(pile: UTItemPile): boolean;
}

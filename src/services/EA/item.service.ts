import { UTItemPile } from "../../types/enums/enums";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { observableToPromise } from "../../utils/observableToPromise";

export const move = async (item: UTItem, pile: UTItemPile) => {
  await observableToPromise(services.Item.move(item, pile));
  return true;
};

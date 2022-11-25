import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { runHooks } from "../runHooks";
import { checkTransferListSize } from "./checkTransferListSize";
import { updatePurchasedCount } from "./updatePurchasedCount";

const hooks = [updatePurchasedCount, checkTransferListSize];

export const runSellHooks = (item: UTItem) => {
  return runHooks(hooks, item);
};

import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { runHooks } from "../runHooks";
import { addToCache } from "./addToCache";
import { checkBuyPrice } from "./checkBuyPrice";
import { checkIfCached } from "./checkIfCached";
import { checkIfExpired } from "./checkIfExpired";

const hooks = [checkIfCached, checkIfExpired, checkBuyPrice, addToCache];

export const runBidHooks = (item: UTItem) => {
  return runHooks(hooks, item);
};

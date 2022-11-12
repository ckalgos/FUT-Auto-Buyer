import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";
import { runHooks } from "../runHooks";
import { buyPriceValidator } from "./buyPriceValidator";
import { randomMinBuyChange } from "./randomMinBuyChange";

const hooks = [buyPriceValidator, randomMinBuyChange];

export const runSearchHooks = (searchCriteria: UTSearchCriteria) => {
  return runHooks(hooks, searchCriteria);
};

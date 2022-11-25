import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";
import { runHooks } from "../runHooks";
import { buyPriceValidator } from "./buyPriceValidator";
import { randomMinBuyChange } from "./randomMinBuyChange";
import { updateSearchCount } from "./updateSearchCount";

const hooks = [buyPriceValidator, randomMinBuyChange, updateSearchCount];

export const runSearchHooks = (searchCriteria: UTSearchCriteria) => {
  return runHooks(hooks, searchCriteria);
};

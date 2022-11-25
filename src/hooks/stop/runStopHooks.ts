import { runHooks } from "../runHooks";
import { checkPurchasedCount } from "./checkPurchasedCount";

const hooks = [checkPurchasedCount];

export const runStopHooks = () => {
  return runHooks(hooks, undefined as never);
};

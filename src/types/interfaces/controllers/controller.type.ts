import { UTMarketSearchFiltersViewController } from "./UTMarketSearchFiltersViewController.interface";
import { UTMarketSearchResultsSplitViewController } from "./UTMarketSearchResultsSplitViewController.interface";
import { UTViewController } from "./UTViewController.interface";

export type controllerTypes =
  | UTMarketSearchFiltersViewController
  | UTMarketSearchResultsSplitViewController
  | UTViewController;

import { controllerTypes } from "../../types/interfaces/controllers/controller.type";
import { UTMarketSearchFiltersViewController } from "../../types/interfaces/controllers/UTMarketSearchFiltersViewController.interface";
import {
  UTMarketSearchResultsSplitViewController,
  UTMarketSearchResultsViewController,
} from "../../types/interfaces/controllers/UTMarketSearchResultsSplitViewController.interface";

export function isMarketSearchFilterViewController(
  controller: controllerTypes
): controller is UTMarketSearchFiltersViewController {
  return (
    (controller as UTMarketSearchFiltersViewController)?._viewmodel
      ?.searchCriteria !== undefined
  );
}

export function isMarketSearchResultSplitViewController(
  controller: controllerTypes
): controller is UTMarketSearchResultsSplitViewController {
  return (
    (controller as UTMarketSearchResultsSplitViewController)?._leftController
      ?._paginationViewModel !== undefined
  );
}

export function isMarketSearchResultViewController(
  controller: controllerTypes
): controller is UTMarketSearchResultsViewController {
  return (
    (controller as UTMarketSearchResultsViewController)
      ?._paginationViewModel !== undefined
  );
}

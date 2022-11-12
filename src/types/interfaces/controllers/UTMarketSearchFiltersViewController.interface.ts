import { UTBucketedItemSearchViewModel } from "../search/UTBucketedItemSearchViewModel.interface";

import { UTViewController } from "./UTViewController.interface";

export interface UTMarketSearchFiltersViewController extends UTViewController {
  new (): UTMarketSearchFiltersViewController;
  init(): void;
  _viewmodel: UTBucketedItemSearchViewModel;
}

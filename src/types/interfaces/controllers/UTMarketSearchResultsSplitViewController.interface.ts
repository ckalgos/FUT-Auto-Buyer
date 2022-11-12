import { UTTransferMarketPaginationViewModel } from "../results/UTTransferMarketPaginationViewModel.interface";
import { UTViewController } from "./UTViewController.interface";

export interface UTMarketSearchResultsSplitViewController
  extends UTViewController {
  new (): UTMarketSearchResultsSplitViewController;
  init(): void;
  _childViewControllers: UTViewController[];
  _leftController: UTMarketSearchResultsViewController;
}

export interface UTMarketSearchResultsViewController extends UTViewController {
  _paginationViewModel: UTTransferMarketPaginationViewModel;
}

import { UTView } from "../view/UTView.interface";
import { UTNavigationController } from "./UTNavigationController.interface";

export interface UTViewController {
  init(): void;
  viewDidAppear(): void;
  getNavigationController(): UTNavigationController;
  getView(): UTView;
  _getViewInstanceFromData(): string;
  getParentViewController(): UTViewController;
}

import { UTView } from "../view/UTView.interface";
import { UTGameFlowNavigationController } from "./UTGameFlowNavigationController.interface";
import { UTNavigationController } from "./UTNavigationController.interface";

export interface UTGameTabBarController {
  new (): UTGameTabBarController;
  initWithViewControllers(tabs: UTGameFlowNavigationController[]): void;
  viewDidAppear(): void;
  getNavigationController(): UTNavigationController;
  getCurrentViewController(): UTGameFlowNavigationController;
  getView(): UTView;
  prototype: this;
}

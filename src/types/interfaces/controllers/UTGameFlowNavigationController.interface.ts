import { UTTabBarItemView } from "../view/UTTabBarItemView.interface";
import { controllerTypes } from "./controller.type";

export interface UTGameFlowNavigationController {
  new (): UTGameFlowNavigationController;
  initWithRootController(controller: controllerTypes): void;
  tabBarItem: UTTabBarItemView;
  getCurrentController(): controllerTypes;
}

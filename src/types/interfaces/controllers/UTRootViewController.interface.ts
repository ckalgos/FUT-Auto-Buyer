import { UTGameTabBarController } from "./UTGameTabBarController.interface";

export interface UTRootViewController {
  getPresentedViewController(): UTGameTabBarController;
}

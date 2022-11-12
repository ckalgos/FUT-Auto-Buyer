import { UTRootViewController } from "./UTRootViewController.interface";

export interface UTApp {
  new (): UTApp;
  getRootViewController(): UTRootViewController;
}

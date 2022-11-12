import { UTControl } from "../uiControls/UTControl.interface";
import { UTNavigationButtonControl } from "../uiControls/UTNavigationButtonControl.interface";

export interface UTNavigationBarView extends UTControl {
  prototype: this;
  layoutSubviews(...args: unknown[]): void;
  primaryButton: UTNavigationButtonControl;
  _menuBtn: UTNavigationButtonControl;
  __clubInfo: unknown;
}

import { UTControl } from "../uiControls/UTControl.interface";

export interface EAFilterBarView extends UTControl {
  new (): EAFilterBarView;
  addTab(key: Number, label: string): void;
  setActiveTab(index: number): void;
  layoutSubviews(): void;
}

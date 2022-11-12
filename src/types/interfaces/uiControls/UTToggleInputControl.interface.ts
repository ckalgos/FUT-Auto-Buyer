import { UTControl } from "./UTControl.interface";

export interface UTToggleInputControl extends UTControl {
  new (): UTToggleInputControl;
  setLabel(label: string): void;
  getToggleState(): boolean;
  toggle(): void;
}

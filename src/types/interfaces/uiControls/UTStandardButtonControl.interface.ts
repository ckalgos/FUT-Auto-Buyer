import { UTControl } from "./UTControl.interface";

export interface UTStandardButtonControl extends UTControl {
  new (): UTStandardButtonControl;
  setText(text: string): void;
  setSubText(text: string): void;
  addClass(text: string): void;
}

import { UTControl } from "./UTControl.interface";

export interface UTTextInputControl<R = string> extends UTControl {
  new (): UTTextInputControl;
  getValue(): R | undefined;
  setValue(value: R): void;
  setPlaceholder(placeHolder: string): void;
}

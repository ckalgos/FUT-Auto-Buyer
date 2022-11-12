import { UTControl } from "./UTControl.interface";

export interface UTTextInputControl<T = string> extends UTControl {
  new (): UTTextInputControl;
  getValue(): T | undefined;
  setValue(value: T): void;
  setPlaceholder(placeHolder: string): void;
}

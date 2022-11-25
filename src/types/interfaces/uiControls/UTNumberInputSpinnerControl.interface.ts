import { UTTextInputControl } from "./UTTextInputControl.interface";

export interface UTNumberInputSpinnerControl
  extends UTTextInputControl<number> {
  new (): UTNumberInputSpinnerControl;
  getNumberInput(): UTTextInputControl<number>;
}

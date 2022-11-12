import { UTTextInputControl } from "./UTTextInputControl.interface";

export interface UTNumericInputSpinnerControl
  extends UTTextInputControl<number> {
  new (): UTNumericInputSpinnerControl;
  getInput(): UTTextInputControl;
  setMinValue(value: number): void;
  setLimits(start: number, end: number): void;
}

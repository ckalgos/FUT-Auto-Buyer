import { UTTextInputControl } from "./UTTextInputControl.interface";

export interface UTNumericInputSpinnerControl
  extends Omit<UTTextInputControl<number>, "addTarget" | "setPlaceholder"> {
  new (): UTNumericInputSpinnerControl;
  getInput(): UTTextInputControl<number>;
  setMinValue(value: number): void;
  setLimits(start: number, end: number): void;
}

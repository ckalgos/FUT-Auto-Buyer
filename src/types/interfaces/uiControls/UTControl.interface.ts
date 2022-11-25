export interface UTControl {
  addTarget(control: unknown, callBack: Function, event: string): void;
  addClass(className: string): void;
  getRootElement(): HTMLElement;
  init(): void;
  removeFromSuperview(): void;
  setInteractionState(state: boolean): void;
  setType(type: string): void;
}

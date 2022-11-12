import { find } from "./dom.util";

export const dispatchTapEvent = (element: HTMLElement, event: string) => {
  const mouseEvent = new MouseEvent(event);
  element.dispatchEvent(mouseEvent);
};

export const dispatchChangeEvent = (element: HTMLElement) => {
  const event = new Event("change");
  element.dispatchEvent(event);
};

export const tap = (selector: string) => {
  const element = find(selector);
  if (element) {
    dispatchTapEvent(element, "mousedown");
    dispatchTapEvent(element, "mouseup");
  }
};

export const tapElement = (element: HTMLElement) => {
  dispatchTapEvent(element, "mousedown");
  dispatchTapEvent(element, "mouseup");
};

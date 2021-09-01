import {
  idClearLogButton,
  idSearchCancelButton,
} from "../../elementIds.constants";

export const createButton = function (text, callBack, customClass) {
  const stdButton = new UTStandardButtonControl();
  stdButton.init();
  stdButton.addTarget(this, callBack, EventType.TAP);
  stdButton.setText(text);

  if (customClass) {
    stdButton.getRootElement().classList.add(customClass);
  }

  return stdButton;
};

export const getActionButtons = () => {
  return `<button class="btn-standard" id="${idSearchCancelButton}">Stop</button><button class="btn-standard" id="${idClearLogButton}">Clear Log</button>`;
};

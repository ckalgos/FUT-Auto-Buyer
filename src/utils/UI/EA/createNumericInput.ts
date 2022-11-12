export const createNumericInput = function (
  callBack: (value: number | undefined) => void,
  label: string,
  defaultValue?: number,
  customClass?: string
) {
  const panelRow = document.createElement("div");
  panelRow.classList.add("panelActionRow");
  panelRow.style.fontSize = "1rem";

  if (customClass) {
    const classes = customClass.split(" ");
    for (let cl of classes) panelRow.classList.add(cl);
  }

  var buttonLabel = document.createElement("div");
  buttonLabel.classList.add("buttonInfoLabel");

  const labelContainer = document.createElement("span");
  labelContainer.classList.add("spinnerLabel");
  labelContainer.textContent = label;

  buttonLabel.append(labelContainer);

  panelRow.append(buttonLabel);

  const numericInput = new UTNumericInputSpinnerControl();
  numericInput.init();

  const numericTextInput = numericInput.getInput();

  numericTextInput.setPlaceholder(
    services.Localization?.localize("roles.defaultRole") || ""
  );

  numericTextInput.addTarget(
    numericInput,
    () => callBack(numericInput.getValue()),
    EventType.CHANGE
  );

  defaultValue && numericInput.setValue(defaultValue);

  panelRow.append(numericInput.getRootElement());
  return panelRow;
};

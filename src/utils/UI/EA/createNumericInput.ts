export const createNumericInput = function (
  callBack: (value: number | undefined) => void,
  label: string,
  isNumberInput: boolean = false,
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

  const input = isNumberInput
    ? createNumberSpinnerInput(callBack)
    : createNumericSpinnerInput(callBack);

  defaultValue && input.setValue(defaultValue);

  panelRow.append(input.getRootElement());
  return panelRow;
};

const createNumericSpinnerInput = (
  callBack: (value: number | undefined) => void
) => {
  const numericInput = new UTNumericInputSpinnerControl();
  numericInput.init();

  const numericTextInput = numericInput.getInput();
  numericTextInput.addTarget(
    numericInput,
    () => callBack(numericInput.getValue()),
    EventType.CHANGE
  );
  numericTextInput.setPlaceholder(
    services.Localization?.localize("roles.defaultRole") || ""
  );

  return numericInput;
};

const createNumberSpinnerInput = (
  callBack: (value: number | undefined) => void
) => {
  const numberInput = new UTNumberInputSpinnerControl();
  numberInput.init();
  numberInput.addTarget(
    numberInput,
    () => callBack(numberInput.getValue()),
    EventType.CHANGE
  );
  numberInput.setPlaceholder(
    services.Localization?.localize(
      "playerHealth.inputPlaceholder.unlimited"
    ) || ""
  );
  return numberInput;
};

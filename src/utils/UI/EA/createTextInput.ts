export const createTextInput = function (
  callBack: (value: string | undefined) => void,
  label: string,
  defaultValue?: string,
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

  const textInput = new UTTextInputControl();
  textInput.init();
  textInput.addTarget(
    textInput,
    () => callBack(textInput.getValue()),
    EventType.CHANGE
  );
  defaultValue && textInput.setValue(defaultValue);

  panelRow.append(textInput.getRootElement());
  return panelRow;
};

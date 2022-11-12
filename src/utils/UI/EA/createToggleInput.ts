export const createToggleInput = function (
  text: string,
  callBack: (toogled: boolean) => void,
  isDefaultToggled: boolean = false,
  customClass?: string
) {
  const panelRow = document.createElement("div");
  panelRow.classList.add("panelActionRow");
  panelRow.classList.add("toggle-control");
  panelRow.style.fontSize = "1rem";

  const toggleCellView = new UTToggleCellView();
  toggleCellView.init();
  isDefaultToggled && toggleCellView.toggle();
  toggleCellView.addTarget(
    toggleCellView,
    () => callBack(toggleCellView.getToggleState()),
    EventType.TAP
  );
  toggleCellView.setLabel(text);

  if (customClass) {
    const classes = customClass.split(" ");
    for (let cl of classes) panelRow.classList.add(cl);
  }

  panelRow.append(toggleCellView.getRootElement());
  return panelRow;
};

export const createButton = function (
  text: string,
  callBack: Function,
  customClass?: string
) {
  const stdButton = new UTStandardButtonControl();
  stdButton.init();
  stdButton.addTarget(stdButton, callBack, EventType.TAP);
  stdButton.setText(text);

  if (customClass) {
    const classes = customClass.split(" ");
    for (let cl of classes) stdButton.getRootElement().classList.add(cl);
  }

  return stdButton;
};

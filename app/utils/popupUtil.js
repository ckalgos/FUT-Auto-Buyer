export const showPopUp = (options, title, message, selectCallBack) => {
  const messagePopUp = new EADialogViewController({
    dialogOptions: options,
    message,
    title,
  });
  messagePopUp.init();
  messagePopUp.onExit.observe(this, function (e, t) {
    e.unobserve(this), selectCallBack.call(this, t);
  });
  gPopupClickShield.setActivePopup(messagePopUp);
};

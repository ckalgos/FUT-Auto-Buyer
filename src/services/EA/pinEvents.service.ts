export const sendPinEvents = (pageId: string) => {
  services.PIN.sendData(PINEventType.PAGE_VIEW, {
    type: PIN_PAGEVIEW_EVT_TYPE,
    pgid: pageId,
  });
};

import { getBuyerSettings } from "../services/repository";

export const sendUINotification = function (message, notificationType) {
  notificationType = notificationType || UINotificationType.POSITIVE;
  services.Notification.queue([message, notificationType]);
};

export const sendPinEvents = (pageId) => {
  services.PIN.sendData(PINEventType.PAGE_VIEW, {
    type: PIN_PAGEVIEW_EVT_TYPE,
    pgid: pageId,
  });
};

export const sendNotificationToUser = (message, isTestMessage) => {
  const buyerSetting = getBuyerSettings();
  if (buyerSetting["idAbMessageNotificationToggle"] || isTestMessage) {
    isPhone()
      ? sendNotificationToExternalPhone(message)
      : sendNotificationToExternal(buyerSetting, message);
    isTestMessage && sendUINotification("Test Notification Sent");
  }
};

const sendNotificationToExternalPhone = (message) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "Notification", message })
  );
};

const sendNotificationToExternal = (buyerSetting, message) => {
  let telegramToken = buyerSetting["idTelegramBotToken"];
  let telegramChatId = buyerSetting["idTelegramChatId"];
  let webHookUrl = buyerSetting["idWebHookUrl"];
  let alertAppNotificationToken = buyerSetting["idFUTMarketAlertToken"];
  sendMessageToTelegram(telegramToken, telegramChatId, message);
  sendMessageToDiscord(webHookUrl, message);
  sendMessageToAlertApp(alertAppNotificationToken, message);
};

const sendMessageToTelegram = (telegramToken, telegramChatId, message) => {
  if (telegramToken && telegramChatId) {
    let url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&parse_mode=Markdown&text=${message}`;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
  }
};

const sendMessageToDiscord = (webHookUrl, message) => {
  if (webHookUrl) {
    fetch(webHookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: message,
      }),
    });
  }
};

const sendMessageToAlertApp = (notificationToken, message) => {
  if (notificationToken) {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          to: `ExponentPushToken[${notificationToken}]`,
          title: message,
          body: message,
        },
      ]),
    });
  }
};

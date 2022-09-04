import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { getBuyerSettings, getValue, setValue } from "../services/repository";
import { loadFilter } from "./userExternalUtil";

let discordClient = null;

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
  if (!isTestMessage) {
    sendUINotification(message);
  }
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
  let channelId = buyerSetting["idDiscordChannelId"];
  sendMessageToTelegram(telegramToken, telegramChatId, message);
  sendMessageToDiscord(channelId, message);
};

const sendMessageToTelegram = (telegramToken, telegramChatId, message) => {
  if (telegramToken && telegramChatId) {
    let url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&parse_mode=Markdown&text=${message}`;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
  }
};

const sendMessageToDiscord = (channelId, message) => {
  if (channelId) {
    if (discordClient) {
      const channel = discordClient.channels.get(channelId);
      channel && channel.send(message);
    } else {
      discordClient = initializeDiscordClient(() => {
        setTimeout(() => {
          if (discordClient) {
            const channel = discordClient.channels.get(channelId);
            channel && channel.send(message);
          }
        }, 200);
      });
    }
  }
};

export const initializeDiscordClient = (cb) => {
  const buyerSetting = getBuyerSettings();
  const client = new Discord.Client();
  let discordToken = buyerSetting["idDiscordToken"];
  if (!discordToken) return null;
  try {
    client.login(discordToken);
    client.on("ready", function () {
      if (cb) {
        cb();
      }
    });
    client.on("message", function (message) {
      if (message.author.id == client.user.id) return;
      if (/start/i.test(message.content)) {
        const instance = getValue("AutoBuyerInstance");
        startAutoBuyer.call(instance);
        message.channel.sendMessage("Bot started successfully");
      } else if (/stop/i.test(message.content)) {
        stopAutoBuyer();
        message.channel.sendMessage("Bot stopped successfully");
      } else if (/runfilter/i.test(message.content)) {
        let filterName = message.content.split("-")[1];
        if (filterName) {
          filterName = filterName.toUpperCase();
          stopAutoBuyer();
          setValue("selectedFilters", []);
          const instance = getValue("AutoBuyerInstance");
          const isSuccess = loadFilter.call(instance, filterName);
          if (!isSuccess) {
            message.channel.sendMessage(`unable to find filter${filterName}`);
            return;
          }
          startAutoBuyer.call(instance);
          message.channel.sendMessage(`${filterName} started successfully`);
        } else {
          message.channel.sendMessage("Unable to find filter name");
        }
      }
    });
  } catch (err) {}
  return client;
};

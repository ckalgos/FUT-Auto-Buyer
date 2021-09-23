import { getValue } from "../services/repository";

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
  const buyerSetting = getValue("BuyerSettings");
  if (buyerSetting["idAbMessageNotificationToggle"] || isTestMessage) {
    sendNotificationToExternal(buyerSetting, message);
    isTestMessage && sendUINotification("Test Notification Sent");
  }
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
      discordClient.channels.get(channelId).send(message);
    } else {
      discordClient = initializeDiscordClient(() => {
        setTimeout(() => {
          if (discordClient) {
            discordClient.channels.get(channelId).send(message);
          }
        }, 200);
      });
    }
  }
};

const initializeDiscordClient = (cb) => {
  const buyerSetting = getValue("BuyerSettings");
  const client = new Discord.Client();
  let discordToken = buyerSetting["idDiscordToken"];
  if (!discordToken) return null;
  client.login(discordToken);
  client.on("ready", function () {
    if (cb) {
      cb();
    }
  });
  client.on("message", function (message) {
    if (message.author.id == client.user.id) return;
    if (/start/i.test(message.content)) {
      window.activateAutoBuyer(true);
      message.channel.sendMessage("Bot started successfully");
    } else if (/stop/i.test(message.content)) {
      window.deactivateAutoBuyer(true);
      message.channel.sendMessage("Bot stopped successfully");
    }
  });
  return client;
};

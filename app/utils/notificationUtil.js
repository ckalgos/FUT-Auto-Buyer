import { getBuyerSettings, setValue, getValue } from "../services/repository";
import { stopAutoBuyer, startAutoBuyer } from "../handlers/autobuyerProcessor";
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

export const sendNotificationToUser = (message, isSuccess, isTestMessage) => {
  const buyerSetting = getBuyerSettings();
  if (buyerSetting["idAbMessageNotificationToggle"] || isTestMessage) {
    isPhone()
      ? sendNotificationToExternalPhone(message)
      : sendNotificationToExternal(buyerSetting, isSuccess, message);
    isTestMessage && sendUINotification("Test Notification Sent");
  }
};

const sendNotificationToExternalPhone = (message) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "Notification", message })
  );
};

const formDiscordMessage = (message, isSuccess) => {
  return {
    embeds: [
      {
        description: message,
        color: isSuccess ? 2555648 : 16711680,
        footer: {
          text: `Auto Buyer Alert - ${new Date().toLocaleTimeString()}`,
          icon_url:
            "https://cdn.discordapp.com/icons/768336764447621122/9de9ea0a7c6239e2f2fbfbd716189e79.webp",
        },
      },
    ],
    avatar_url:
      "https://cdn.discordapp.com/icons/768336764447621122/9de9ea0a7c6239e2f2fbfbd716189e79.webp",
    username: "Fut Market Alert",
  };
};

const formDiscordRichEmbed = (discordMessage) => {
  const {
    embeds: [message],
  } = discordMessage;
  return new Discord.RichEmbed()
    .setColor(message.color)
    .setDescription(message.description)
    .setFooter(message.footer.text, message.footer.icon_url);
};

const sendNotificationToExternal = (buyerSetting, isSuccess, message) => {
  const telegramToken = buyerSetting["idTelegramBotToken"];
  const telegramChatId = buyerSetting["idTelegramChatId"];
  const webHookUrl = buyerSetting["idWebHookUrl"];
  const channelId = buyerSetting["idDiscordChannelId"];
  const alertAppNotificationToken = buyerSetting["idFUTMarketAlertToken"];
  sendMessageToTelegram(telegramToken, telegramChatId, message);
  sendMessageToDiscord(channelId, isSuccess, message);
  sendMessageToDiscordWH(webHookUrl, isSuccess, message);
  sendMessageToAlertApp(alertAppNotificationToken, message);
};

const sendMessageToTelegram = (telegramToken, telegramChatId, message) => {
  if (telegramToken && telegramChatId) {
    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&parse_mode=Markdown&text=${message}`;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, true);
    xhttp.send();
  }
};

const sendMessageToDiscordWH = (webHookUrl, isSuccess, message) => {
  if (webHookUrl) {
    fetch(webHookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formDiscordMessage(message, isSuccess)),
    });
  }
};

const sendMessageToDiscord = (channelId, isSuccess, message) => {
  if (channelId) {
    if (discordClient) {
      const channel = discordClient.channels.get(channelId);
      channel &&
        channel.send(
          formDiscordRichEmbed(formDiscordMessage(message, isSuccess))
        );
    } else {
      discordClient = initializeDiscordClient(() => {
        setTimeout(() => {
          if (discordClient) {
            const channel = discordClient.channels.get(channelId);
            channel &&
              channel.send(
                formDiscordRichEmbed(formDiscordMessage(message, isSuccess))
              );
          }
        }, 200);
      });
    }
  }
};

const initializeDiscordClient = (cb) => {
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
    client.on("message", async function (message) {
      if (message.author.id == client.user.id) return;
      if (/start/i.test(message.content)) {
        const instance = getValue("AutoBuyerInstance");
        startAutoBuyer.call(instance);
        message.channel.send(
          formDiscordRichEmbed(
            formDiscordMessage("Bot started successfully", true)
          )
        );
      } else if (/stop/i.test(message.content)) {
        stopAutoBuyer();
        message.channel.send(
          formDiscordRichEmbed(
            formDiscordMessage("Bot stopped successfully", true)
          )
        );
      } else if (/runfilter/i.test(message.content)) {
        let filterName = message.content.split("-")[1];
        if (filterName) {
          filterName = filterName.toUpperCase();
          stopAutoBuyer();
          setValue("selectedFilters", []);
          const instance = getValue("AutoBuyerInstance");
          const isSuccess = await loadFilter.call(instance, filterName);
          if (!isSuccess) {
            message.channel.send(
              formDiscordRichEmbed(
                formDiscordMessage(`unable to find filter${filterName}`, false)
              )
            );
            return;
          }
          startAutoBuyer.call(instance);
          message.channel.send(
            formDiscordRichEmbed(
              formDiscordMessage(`${filterName} started successfully`, true)
            )
          );
        } else {
          message.channel.send(
            formDiscordRichEmbed(
              formDiscordMessage("Unable to find filter name", false)
            )
          );
        }
      }
    });
  } catch (err) {}
  return client;
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

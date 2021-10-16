import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { getValue } from "./repository";

let discordClient;
let discordChannelId;

export const initializeDiscord = (discordToken, channelId) => {
  if (discordClient) return;

  discordClient = new Discord.Client();
  discordClient.login(discordToken);
  discordClient.on("ready", () => {});
  discordClient.on("message", function (message) {
    const content = parseContent(message);
    const currentStats = getValue("sessionStats");
    if (!content.command || content.sessionId !== currentStats.sessionId)
      return;

    switch (content.command) {
      case "start": {
        const instance = getValue("AutoBuyerInstance");
        return startAutoBuyer.call(instance);
      }
      case "stop": {
        return stopAutoBuyer();
      }
    }
    message.delete(5000);
  });
  discordChannelId = channelId;
};

export const sendMessageToDiscord = async (message) => {
  if (discordChannelId) {
    const channel = discordClient.channels.get(discordChannelId);
    if (channel) {
      const messageRef = await channel.send(message);
      messageRef.delete(5000);
    }
  }
};

const parseContent = (content) => {
  try {
    return JSON.parse(content);
  } catch (e) {
    return content;
  }
};

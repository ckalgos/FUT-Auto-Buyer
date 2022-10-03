import { convertToSeconds, wait } from "./commonUtil";
import { getSellBidPrice } from "./priceUtils";
import { getBuyerSettings, getValue } from "../services/repository";
import { idProgressAutobuyer } from "../elementIds.constants";
import { sendNotificationToUser } from "./notificationUtil";
import { updateProfit } from "./statsUtil";
import { writeToLog } from "./logUtil";

export const processSellQueue = async () => {
  const sellQueue = getValue("sellQueue") || [];
  const buyerSettings = getBuyerSettings();
  const notificationType = buyerSettings["idNotificationType"];
  const hasItemInQueue = sellQueue.length;
  hasItemInQueue && writeToLog("--------------------", idProgressAutobuyer);
  while (sellQueue.length) {
    const { player, sellPrice, shouldList, playerName, profit } =
      sellQueue.pop();
    const message = await sellItems(
      player,
      sellPrice,
      profit,
      shouldList,
      buyerSettings
    );
    updateLog(
      sellPrice,
      shouldList,
      profit,
      buyerSettings,
      playerName,
      message,
      notificationType
    );
    sellQueue.length && (await wait(2));
  }
  hasItemInQueue && writeToLog("--------------------", idProgressAutobuyer);
};

const updateLog = (
  sellPrice,
  shouldList,
  profit,
  buyerSetting,
  playerName,
  message,
  notificationType
) => {
  const formattedMessage = `${playerName}, ${
    message
      ? message
      : sellPrice < 0
      ? "moved to transferlist"
      : shouldList
      ? "selling for: " + sellPrice + ", Profit: " + profit
      : buyerSetting["idAbDontMoveWon"]
      ? ""
      : "moved to club"
  } `;
  writeToLog(formattedMessage, idProgressAutobuyer);
  if (notificationType === "B" || notificationType === "A") {
    sendNotificationToUser(formattedMessage, true);
  }
};

const sellItems = (player, sellPrice, profit, shouldList, buyerSetting) => {
  return new Promise((resolve) => {
    if (sellPrice < 0) {
      services.Item.move(player, ItemPile.TRANSFER).observe(
        this,
        async function () {
          resolve();
        }
      );
    } else if (shouldList) {
      if (repositories.Item.isPileFull(ItemPile.TRANSFER)) {
        return resolve("Unable to list, transfer List if Full");
      }
      updateProfit(profit);
      services.Item.list(
        player,
        getSellBidPrice(sellPrice),
        sellPrice,
        convertToSeconds(buyerSetting["idFutBinDuration"] || "1H") || 3600
      ).observe(this, async function (sender, response) {
        resolve();
      });
    } else {
      services.Item.move(player, ItemPile.CLUB).observe(
        this,
        async function (sender, response) {
          resolve();
        }
      );
    }
  });
};

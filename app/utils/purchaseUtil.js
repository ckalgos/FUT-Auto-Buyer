import { errorCodeLookUp } from "../app.constants";
import { idProgressAutobuyer } from "../elementIds.constants";
import { stopAutoBuyer } from "../handlers/autobuyerProcessor";
import {
  getValue,
  increAndGetStoreValue,
  setValue,
} from "../services/repository";
import {
  convertToSeconds,
  formatString,
  getRandWaitTime,
  playAudio,
  wait,
} from "./commonUtil";
import { getSellPriceFromFutBin } from "./futbinUtil";
import { writeToAbLog, writeToLog } from "./logUtil";
import { sendNotificationToUser } from "./notificationUtil";
import { getSellBidPrice } from "./priceUtils";
import { updateProfit } from "./statsUtil";

export const checkRating = (
  cardRating,
  permittedRatingMin,
  permittedRatingMax
) => cardRating >= permittedRatingMin && cardRating <= permittedRatingMax;

const errorCodeCountMap = new Map();

export const buyPlayer = (
  player,
  playerName,
  price,
  sellPrice,
  isBin,
  tradeId
) => {
  const buyerSetting = getValue("BuyerSettings");
  return new Promise((resolve) => {
    services.Item.bid(player, price).observe(
      this,
      async function (sender, data) {
        let priceTxt = formatString(price.toString(), 6);
        const notificationType = buyerSetting["idNotificationType"];
        let sendDetailedNotification = buyerSetting["idDetailedNotification"];
        let logMessage = "";

        if (data.success) {
          if (isBin) {
            increAndGetStoreValue("purchasedCardCount");
            playAudio("cardWon");
          }
          const ratingThreshold = buyerSetting["idSellRatingThreshold"];
          let playerRating = parseInt(player.rating);
          const isValidRating =
            !ratingThreshold || playerRating <= ratingThreshold;

          const useFutBinPrice = buyerSetting["idSellFutBinPrice"];
          if (isValidRating && useFutBinPrice) {
            sellPrice = await getSellPriceFromFutBin(
              buyerSetting,
              playerName,
              player
            );
          }

          const shouldList = sellPrice && !isNaN(sellPrice) && isValidRating;

          if (isBin) {
            let winCount = increAndGetStoreValue("winCount");
            let sym = " W:" + formatString(winCount.toString(), 4);
            logMessage = writeToAbLog(
              sym,
              playerName,
              priceTxt,
              "buy",
              "success",
              sellPrice < 0
                ? "move to transferlist"
                : shouldList
                ? "selling for: " + sellPrice
                : "move to club"
            );

            setTimeout(function () {
              if (sellPrice < 0) {
                services.Item.move(player, ItemPile.TRANSFER);
              } else if (shouldList) {
                updateProfit(sellPrice * 0.95 - price);
                services.Item.list(
                  player,
                  getSellBidPrice(sellPrice),
                  sellPrice,
                  3600
                );
              } else {
                services.Item.move(player, ItemPile.CLUB);
              }
            }, getRandWaitTime(buyerSetting["idAbWaitTime"]));
          } else {
            let bidCount = increAndGetStoreValue("bidCount");
            let sym = " B:" + formatString(bidCount.toString(), 4);
            logMessage = writeToAbLog(
              sym,
              playerName,
              priceTxt,
              "bid",
              "success",
              "waiting to expire"
            );
            const filterName = getValue("currentFilter");
            if (filterName) {
              const bidItemsByFilter = getValue("filterBidItems") || new Map();
              if (bidItemsByFilter.has(filterName)) {
                bidItemsByFilter.get(filterName).add(tradeId);
              } else {
                bidItemsByFilter.set(filterName, new Set([tradeId]));
              }
              setValue("filterBidItems", bidItemsByFilter);
            }
          }

          if (notificationType === "B" || notificationType === "A") {
            if (sendDetailedNotification) sendNotificationToUser(logMessage);
            else
              sendNotificationToUser(
                `|  ${playerName.trim()}  | ${priceTxt.trim()} | buy |`
              );
          }
        } else {
          let lossCount = increAndGetStoreValue("lossCount");
          let sym = " L:" + formatString(lossCount.toString(), 4);
          let status = (data.error?.code || data.status) + "";
          logMessage = writeToAbLog(
            sym,
            playerName,
            priceTxt,
            isBin ? "buy" : "bid",
            "failure",
            " ERR: " + (errorCodeLookUp[status] || status)
          );
          if (notificationType === "L" || notificationType === "A") {
            if (sendDetailedNotification) sendNotificationToUser(logMessage);
            else
              sendNotificationToUser(
                `| ${playerName.trim()} | ${priceTxt.trim()} | failure |`
              );
          }

          if (buyerSetting["idAbStopErrorCode"]) {
            const errorCodes = new Set(
              buyerSetting["idAbStopErrorCode"].split(",")
            );

            if (!errorCodeCountMap.has(status))
              errorCodeCountMap.set(status, { currentVal: 0 });

            errorCodeCountMap.get(status).currentVal++;

            if (
              errorCodes.has(status) &&
              errorCodeCountMap.get(status).currentVal >=
                buyerSetting["idAbStopErrorCodeCount"]
            ) {
              logMessage = writeToLog(
                `[!!!] Autostopping bot since error code ${status} has occured ${
                  errorCodeCountMap.get(status).currentVal
                } times\n`,
                idProgressAutobuyer
              );
              errorCodeCountMap.clear();
              stopAutoBuyer();
              if (sendDetailedNotification) sendNotificationToUser(logMessage);
            }
          }
        }
        buyerSetting["idAbAddBuyDelay"] &&
          (await wait(convertToSeconds(buyerSetting["idAbDelayToAdd"])));
        resolve();
      }
    );
  });
};

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
              player.definitionId
            );
          }

          const shouldList = sellPrice && !isNaN(sellPrice) && isValidRating;

          if (isBin) {
            let winCount = increAndGetStoreValue("winCount");
            let sym = " W:" + formatString(winCount.toString(), 4);
            writeToAbLog(
              sym,
              playerName,
              priceTxt,
              "buy",
              "success",
              shouldList ? "selling for: " + sellPrice : "move to club"
            );

            setTimeout(function () {
              if (shouldList) {
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
            writeToAbLog(
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
            sendNotificationToUser(
              "| " + playerName.trim() + " | " + priceTxt.trim() + " | buy |"
            );
          }
        } else {
          let lossCount = increAndGetStoreValue("lossCount");
          let sym = " L:" + formatString(lossCount.toString(), 4);
          let status = (data.error?.code || data.status) + "";
          writeToAbLog(
            sym,
            playerName,
            priceTxt,
            isBin ? "buy" : "bid",
            "failure",
            " ERR: " + status
          );
          if (notificationType === "L" || notificationType === "A") {
            sendNotificationToUser(
              "| " +
                playerName.trim() +
                " | " +
                priceTxt.trim() +
                " | failure |"
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
              writeToLog(
                `[!!!] Autostopping bot since error code ${status} has occured ${
                  errorCodeCountMap.get(status).currentVal
                } times\n`,
                idProgressAutobuyer
              );
              errorCodeCountMap.clear();
              stopAutoBuyer();
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

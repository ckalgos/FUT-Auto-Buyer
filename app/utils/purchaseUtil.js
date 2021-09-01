import {
  idAutoBuyerFoundLog,
  idProgressAutobuyer,
} from "../elementIds.constants";
import { stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { getValue, increAndGetStoreValue } from "../services/repository";
import {
  convertToSeconds,
  formatString,
  getRandWaitTime,
  wait,
} from "./commonUtil";
import { fetchPricesFromFutBin } from "./futbinUtil";
import { writeToAbLog, writeToLog } from "./logUtil";
import { sendNotificationToUser } from "./notificationUtil";
import { getSellBidPrice, roundOffPrice } from "./priceUtils";
import { getUserPlatform } from "./userUtil";

export const checkRating = (
  cardRating,
  permittedRatingMin,
  permittedRatingMax
) => cardRating >= permittedRatingMin && cardRating <= permittedRatingMax;

const errorCodeCountMap = new Map();

export const buyPlayer = (player, playerName, price, sellPrice, isBin) => {
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
            // window.play_audio("card_won");
          }
          const ratingThreshold = buyerSetting["idSellRatingThreshold"];
          let playerRating = parseInt(player.rating);
          const isValidRating =
            !ratingThreshold || playerRating <= ratingThreshold;

          const useFutBinPrice = buyerSetting["idSellFutBinPrice"];
          if (useFutBinPrice) {
            try {
              const futBinResponse = await fetchPricesFromFutBin(
                player.resourceId,
                3
              );
              if (futBinResponse.status === 200) {
                const futBinPrices = JSON.parse(futBinResponse.responseText);
                sellPrice = parseInt(
                  futBinPrices[player.resourceId].prices[
                    getUserPlatform()
                  ].LCPrice.replace(/[,.]/g, "")
                );
                const futBinPercent = buyerSetting["idSellFutBinPercent"];
                const calculatedPrice = roundOffPrice(
                  (sellPrice * futBinPercent) / 100
                );
                writeToLog(
                  `= Futbin price for ${playerName}: ${sellPrice}: ${futBinPercent}% of sale price: ${calculatedPrice}`,
                  idAutoBuyerFoundLog
                );
                sellPrice = calculatedPrice;
              } else {
                sellPrice = null;
                writeToLog(
                  `= Unable to get Futbin price for ${playerName}`,
                  idAutoBuyerFoundLog
                );
              }
            } catch (err) {
              err = err.statusText || err.status || err;
              sellPrice = null;
              writeToLog(
                `= Unable to get Futbin price for ${playerName}, err: ${
                  err || "error occured"
                }`,
                idAutoBuyerFoundLog
              );
            }
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

import { errorCodeLookUp } from "../app.constants";
import { idProgressAutobuyer } from "../elementIds.constants";
import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import {
  getBuyerSettings,
  getValue,
  increAndGetStoreValue,
  setValue,
} from "../services/repository";
import {
  convertRangeToSeconds,
  convertToSeconds,
  formatString,
  playAudio,
  wait,
} from "./commonUtil";
import { getSellPriceFromFutBin } from "./futbinUtil";
import { writeToLog } from "./logUtil";
import { sendNotificationToUser } from "./notificationUtil";
import { appendTransactions } from "./statsUtil";

const errorCodeCountMap = new Map();

export const buyPlayer = (
  player,
  playerName,
  price,
  sellPrice,
  isBin,
  tradeId
) => {
  const buyerSetting = getBuyerSettings();
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
          if (isValidRating && useFutBinPrice && isBin) {
            sellPrice = await getSellPriceFromFutBin(
              buyerSetting,
              playerName,
              player
            );
          }

          const checkBuyPrice = buyerSetting["idSellCheckBuyPrice"];
          if (checkBuyPrice && price > (sellPrice * 95) / 100) {
            sellPrice = -1;
          }

          const shouldList = sellPrice && !isNaN(sellPrice) && isValidRating;
          const profit = sellPrice * 0.95 - price;

          if (isBin) {
            const winCount = increAndGetStoreValue("winCount");
            appendTransactions(
              `[${new Date().toLocaleTimeString()}] ${playerName.trim()} buy success - Price : ${price}`
            );
            writeToLog(
              `W: ${winCount} ${playerName} buy success added to sell queue`,
              idProgressAutobuyer
            );

            if (!buyerSetting["idAbDontMoveWon"]) {
              const sellQueue = getValue("sellQueue") || [];
              sellQueue.push({
                player,
                playerName,
                sellPrice,
                shouldList,
                profit,
              });
              setValue("sellQueue", sellQueue);
            }
          } else {
            const bidCount = increAndGetStoreValue("bidCount");
            appendTransactions(
              `[${new Date().toLocaleTimeString()}] ${playerName.trim()} bid success - Price : ${price}`
            );
            writeToLog(
              `B:${bidCount} ${playerName} bid success`,
              idProgressAutobuyer
            );
            const filterName = getValue("currentFilter") || "default";
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
          appendTransactions(
            `[${new Date().toLocaleTimeString()}] ${playerName.trim()} buy failed - Price : ${price}`
          );
          let status = ((data.error && data.error.code) || data.status) + "";
          writeToLog(
            `L: ${lossCount} ${playerName} ${
              isBin ? "buy" : "bid"
            } failure ERR: (${
              errorCodeLookUp[status] + "(" + status + ")" || status
            })`,
            idProgressAutobuyer
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

              if (buyerSetting["idAbResumeAfterErrorOccured"]) {
                const pauseFor = convertRangeToSeconds(
                  buyerSetting["idAbResumeAfterErrorOccured"]
                );

                writeToLog(
                  `Bot will resume after ${pauseFor}(s)`,
                  idProgressAutobuyer
                );
                setTimeout(() => {
                  startAutoBuyer.call(getValue("AutoBuyerInstance"));
                }, pauseFor * 1000);
              }
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

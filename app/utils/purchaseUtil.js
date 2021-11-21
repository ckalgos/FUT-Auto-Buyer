import { errorCodeLookUp } from "../app.constants";
import { idProgressAutobuyer } from "../elementIds.constants";
import { stopAutoBuyer } from "../handlers/autobuyerProcessor";
import {
  getBuyerSettings,
  getValue,
  increAndGetStoreValue,
  setValue
} from "../services/repository";
import {
  convertToSeconds,
  formatString,
  getRandWaitTime,
  hideLoader,
  playAudio,
  showLoader,
  wait
} from "./commonUtil";
import { getSellPriceFromFutBin } from "./futbinUtil";
import { writeToAbLog, writeToLog } from "./logUtil";
import { sendNotificationToUser, sendUINotification } from "./notificationUtil";
import { getSellBidPrice } from "./priceUtils";
import { updateProfit } from "./statsUtil";

const createAntiBypassIframes = async () => {
  return new Promise((resolve) => {
    for (let i = 0; i < 4; i++) {
      let tmp = document.createElement("iframe")
      tmp.style.display = "none"
      tmp.src = "https://www.ea.com/fifa/ultimate-team/web-app/"
      document.body.appendChild(tmp)
    }
    resolve()
  })
}

const removeIframes = () => {
  return new Promise((resolve) => {
    for (let z = 0; z < 4; z++) {
      document.querySelector(`iframe`).remove()
      resolve()
    }
  })
}

const softbanIsBypassed = () => {
  return new Promise(async (resolve) => {
    let iframeArray = Array.from(document.querySelectorAll("iframe"))
    let iframeFullyLoadedNb = 0;
    let interval = setInterval(async() => {
      for (let i = 0; i < iframeArray.length; i++) {
        if (iframeFullyLoadedNb === iframeArray.length)
        {
          clearInterval(interval)
          await removeIframes()
          resolve(false)
        }
        if (iframeArray[i].contentDocument.body.querySelector("body > div.view-modal-container.form-modal > section")) {
          await removeIframes()
          resolve(true)
        }
        else if (iframeArray[i].contentDocument.body.querySelector("body > main > section > section > div.ut-navigation-bar-view.navbar-style-landscape > div.view-navbar-clubinfo"))
          iframeFullyLoadedNb++;
      }
    }, 500)
  })
}

const bypassSoftban = () => {
  return new Promise(async (resolve) => {
    for (let i = 0; i < 10; i++) {
      await createAntiBypassIframes()
      let isBypassed = await softbanIsBypassed()
      if (isBypassed)
        resolve(true)
      await removeIframes()
    }
    resolve(false)
  })
}

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
  const buyerSetting = getBuyerSettings();
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
          if (isValidRating && useFutBinPrice && isBin) {
            sellPrice = await getSellPriceFromFutBin(
              buyerSetting,
              playerName,
              player
            );
          }

          const checkBuyPrice = buyerSetting["idSellCheckBuyPrice"];
          if (checkBuyPrice && price > sellPrice) {
            sellPrice = -1;
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
                  convertToSeconds(buyerSetting["idFutBinDuration"] || "1H") ||
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
            `ERR: (${errorCodeLookUp[status] + "(" + status + ")" || status})`
          );
          if (notificationType === "L" || notificationType === "A") {
            if (sendDetailedNotification) sendNotificationToUser(logMessage);
            else
              sendNotificationToUser(
                `| ${playerName.trim()} | ${priceTxt.trim()} | failure |`
              );
          }

          if (buyerSetting["idBypassSoftBan"] && status == 429) {
            showLoader()
            sendUINotification("Softban detected");

            // stopAutoBuyer(true)
            let isBypassed = await bypassSoftban()
            hideLoader()
            if (isBypassed)
            {
              sendUINotification("Softban successfully bypassed");
              // startAutoBuyer.call(this, true);
            }
            else
            {
              sendUINotification("Softban cant be bypassed");
            // stopAutoBuyer(true)
            }
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
              buyerSetting["idAbStopErrorCodeCount"] && !buyerSetting["idBypassSoftBan"]
            ) {
              logMessage = writeToLog(
                `[!!!] Autostopping bot since error code ${status} has occured ${errorCodeCountMap.get(status).currentVal
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

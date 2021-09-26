import { idAbStatus, idAutoBuyerFoundLog } from "../elementIds.constants";
import { trackMarketPrices } from "../services/analytics";
import { getValue, setValue } from "../services/repository";
import {
  pauseBotIfRequired,
  stopBotIfRequired,
  switchFilterIfRequired,
} from "../utils/autoActionsUtil";
import {
  convertToSeconds,
  formatString,
  getRandNum,
  getRangeValue,
} from "../utils/commonUtil";
import { writeToDebugLog, writeToLog } from "../utils/logUtil";
import { sendPinEvents, sendUINotification } from "../utils/notificationUtil";
import {
  getBuyBidPrice,
  getSellBidPrice,
  roundOffPrice,
} from "../utils/priceUtils";
import { buyPlayer, checkRating } from "../utils/purchaseUtil";
import { updateRequestCount } from "../utils/statsUtil";
import { setRandomInterval } from "../utils/timeOutUtil";
import { transferListUtil } from "../utils/transferlistUtil";
import { getUserPlatform } from "../utils/userUtil";
import { addUserWatchItems, watchListUtil } from "../utils/watchlistUtil";
import { searchErrorHandler } from "./errorHandler";

let interval = null;
let passInterval = null;
const currentBids = new Set();

export const startAutoBuyer = async function (isResume) {
  $("#" + idAbStatus)
    .css("color", "#2cbe2d")
    .html("RUNNING");

  const isActive = getValue("autoBuyerActive");
  if (isActive) return;
  sendUINotification(isResume ? "Autobuyer Resumed" : "Autobuyer Started");
  setValue("autoBuyerActive", true);
  if (!isResume) {
    setValue("botStartTime", new Date());
    setValue("purchasedCardCount", 0);
  }
  let switchFilterWithContext = switchFilterIfRequired.bind(this);
  let srchTmWithContext = searchTransferMarket.bind(this);
  let watchListWithContext = watchListUtil.bind(this);
  let transferListWithContext = transferListUtil.bind(this);
  let pauseBotWithContext = pauseBotIfRequired.bind(this);
  switchFilterWithContext();
  let buyerSetting = getValue("BuyerSettings");
  await addUserWatchItems();
  sendPinEvents("Hub - Transfers");
  await srchTmWithContext(buyerSetting);
  sendPinEvents("Hub - Transfers");
  await transferListWithContext(
    buyerSetting["idAbSellToggle"],
    buyerSetting["idAbMinDeleteCount"],
    true
  );
  interval = setRandomInterval(async () => {
    passInterval = pauseBotWithContext(buyerSetting);
    stopBotIfRequired(buyerSetting);
    const isBuyerActive = getValue("autoBuyerActive");
    if (isBuyerActive) {
      switchFilterWithContext();
      buyerSetting = getValue("BuyerSettings");
      sendPinEvents("Hub - Transfers");
      await srchTmWithContext(buyerSetting);
      sendPinEvents("Hub - Transfers");
      await watchListWithContext(buyerSetting);
      sendPinEvents("Hub - Transfers");
      await transferListWithContext(
        buyerSetting["idAbSellToggle"],
        buyerSetting["idAbMinDeleteCount"]
      );
    }
  }, ...getRangeValue(buyerSetting["idAbWaitTime"]));
};

export const stopAutoBuyer = (isPaused) => {
  interval && interval.clear();
  if (!isPaused && passInterval) {
    clearTimeout(passInterval);
  }
  const isActive = getValue("autoBuyerActive");
  if (!isActive) return;
  setValue("autoBuyerActive", false);
  sendUINotification(isPaused ? "Autobuyer Paused" : "Autobuyer Stopped");
  $("#" + idAbStatus)
    .css("color", "red")
    .html("IDLE");
};

const searchTransferMarket = function (buyerSetting) {
  const platform = getUserPlatform();
  return new Promise((resolve) => {
    sendPinEvents("Transfer Market Search");
    updateRequestCount();
    var searchCriteria = this._viewmodel.searchCriteria;

    services.Item.clearTransferMarketCache();

    const expiresIn = convertToSeconds(buyerSetting["idAbItemExpiring"]);
    const useRandMinBid = buyerSetting["idAbRandMinBidToggle"];
    const useRandMinBuy = buyerSetting["idAbRandMinBuyToggle"];
    let currentPage = 1;
    if (useRandMinBid)
      searchCriteria.minBid = roundOffPrice(
        getRandNum(0, buyerSetting["idAbRandMinBidInput"])
      );
    if (useRandMinBuy)
      searchCriteria.minBuy = roundOffPrice(
        getRandNum(0, buyerSetting["idAbRandMinBuyInput"])
      );
    services.Item.searchTransferMarket(searchCriteria, currentPage).observe(
      this,
      async function (sender, response) {
        if (response.success) {
          writeToLog(
            `= Received ${response.data.items.length} items - from page (${currentPage}) => config: (minbid: ${searchCriteria.minBid}-minbuy:${searchCriteria.minBuy})`,
            idAutoBuyerFoundLog
          );

          if (response.data.items.length > 0) {
            writeToLog(
              "| rating   | player name     | bid    | buy    | time            | action",
              idAutoBuyerFoundLog
            );
            currentPage === 1 &&
              sendPinEvents("Transfer Market Results - List View");
          }

          let maxPurchases = buyerSetting["idAbMaxPurchases"];
          const auctionPrices = [];

          for (let i = response.data.items.length - 1; i >= 0; i--) {
            let player = response.data.items[i];
            let auction = player._auction;
            let type = player.type;
            let playerRating = parseInt(player.rating);
            let expires = services.Localization.localizeAuctionTimeRemaining(
              auction.expires
            );

            if (type === "player") {
              const { trackPayLoad, playerPayLoad } = formRequestPayLoad(
                player,
                platform
              );

              auctionPrices.push(trackPayLoad);
            }

            let buyNowPrice = auction.buyNowPrice;
            let currentBid = auction.currentBid || auction.startingBid;
            let isBid = auction.currentBid;
            let bidPrice = buyerSetting["idAbMaxBid"];

            let priceToBid = buyerSetting["idAbBidExact"]
              ? bidPrice
              : isBid
              ? getSellBidPrice(bidPrice)
              : bidPrice;

            let checkPrice = buyerSetting["idAbBidExact"]
              ? priceToBid
              : isBid
              ? getBuyBidPrice(currentBid)
              : currentBid;

            let userBuyNowPrice = buyerSetting["idAbBuyPrice"];
            let usersellPrice = buyerSetting["idAbSellPrice"];
            let minRating = buyerSetting["idAbMinRating"];
            let maxRating = buyerSetting["idAbMaxRating"];

            let bidTxt = formatString(currentBid.toString(), 6);
            let buyTxt = formatString(buyNowPrice.toString(), 6);
            let playerName = formatString(player._staticData.name, 15);
            let expireTime = formatString(expires, 15);

            const shouldCheckRating = minRating || maxRating;

            const isValidRating =
              !shouldCheckRating ||
              checkRating(playerRating, minRating, maxRating);
            const ratingTxt = !isValidRating ? "no" : "ok";

            const logWrite = writeToLogClosure(
              "(" + playerRating + "-" + ratingTxt + ") ",
              playerName,
              bidTxt,
              buyTxt,
              expireTime
            );

            if (currentPage <= 20 && response.data.items.length === 21) {
              currentPage++;
            } else {
              currentPage = 1;
            }

            if (maxPurchases < 1) {
              logWrite("skip >>> (Exceeded num of buys/bids per search)");
              continue;
            }

            if (isNaN(userBuyNowPrice) && isNaN(priceToBid)) {
              logWrite("skip >>> (No Buy or Bid Price given)");
              continue;
            }

            if (!player.preferredPosition && buyerSetting["idAbAddFilterGK"]) {
              logWrite("skip >>> (is a Goalkeeper)");
              continue;
            }

            if (!isValidRating) {
              logWrite("skip >>> (rating does not fit criteria)");
              continue;
            }

            if (currentBids.has(auction.tradeId)) {
              logWrite("skip >>> (Cached Item)");
              continue;
            }

            if (buyNowPrice > userBuyNowPrice && currentBid > priceToBid) {
              logWrite("skip >>> (higher than specified buy/bid price)");
              continue;
            }

            const userCoins = services.User.getUser().coins.amount;
            if (userCoins < buyNowPrice && userCoins < priceToBid) {
              logWrite("skip >>> (Insufficient coins to purchase)");
              continue;
            }

            if (buyNowPrice <= userBuyNowPrice) {
              logWrite("attempt buy: " + buyNowPrice);
              maxPurchases--;
              currentBids.add(auction.tradeId);
              await buyPlayer(
                player,
                playerName,
                buyNowPrice,
                usersellPrice,
                true
              );
              continue;
            }

            if (bidPrice && currentBid <= priceToBid) {
              if (auction.expires > expiresIn) {
                logWrite("skip >>> (Waiting for specified expiry time)");
                continue;
              }
              logWrite("attempt bid: " + checkPrice);
              currentBids.add(auction.tradeId);
              maxPurchases--;
              await buyPlayer(player, playerName, checkPrice, usersellPrice);
            }
          }
          if (auctionPrices.length) {
            trackMarketPrices(auctionPrices);
          }
        } else {
          searchErrorHandler(
            response,
            buyerSetting["idAbSolveCaptcha"],
            buyerSetting["idAbCloseTabToggle"]
          );
        }
        sendPinEvents("Transfer Market Search");
        resolve();
      }
    );
  });
};

const formRequestPayLoad = (player, platform) => {
  const {
    id,
    definitionId,
    _auction: { buyNowPrice, tradeId: auctionId, expires: expiresOn },
    _metaData: { id: assetId, skillMoves, weakFoot } = {},
    _attributes,
    _staticData: { firstName, knownAs, lastName, name } = {},
    nationId,
    leagueId,
    rareflag,
    playStyle,
  } = player;

  const expireDate = new Date();
  expireDate.setSeconds(expireDate.getSeconds() + expiresOn);
  const trackPayLoad = {
    definitionId,
    price: buyNowPrice,
    expiresOn: expireDate,
    id: id + "",
    assetId: assetId + "_" + platform + "_" + rareflag,
    auctionId,
    year: 22,
    updatedOn: new Date(),
    playStyle,
  };
  const playerPayLoad = {
    _id: definitionId,
    nationId,
    leagueId,
    staticData: { firstName, knownAs, lastName, name },
    skillMoves,
    weakFoot,
    assetId,
    attributes: _attributes,
    year: 21,
    rareflag,
  };

  return { trackPayLoad, playerPayLoad };
};

const writeToLogClosure = (
  ratingTxt,
  playerName,
  bidTxt,
  buyTxt,
  expireTime
) => {
  return (actionTxt) => {
    writeToDebugLog(
      ratingTxt,
      playerName,
      bidTxt,
      buyTxt,
      expireTime,
      actionTxt
    );
  };
};

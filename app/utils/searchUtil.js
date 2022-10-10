import { idProgressAutobuyer } from "../elementIds.constants";
import { searchErrorHandler } from "../handlers/errorHandler";
import {
  getDataSource,
  getValue,
  increAndGetStoreValue,
  setValue,
} from "../services/repository";
import { convertToSeconds, getRandNum } from "./commonUtil";
import { checkRating } from "./futItemUtil";
import { writeToLog } from "./logUtil";
import { sendPinEvents } from "./notificationUtil";
import { getBuyBidPrice, getSellBidPrice, roundOffPrice } from "./priceUtils";
import { buyPlayer } from "./purchaseUtil";
import { updateRequestCount } from "./statsUtil";
import { sortPlayers } from "./playerUtil";
import { getStatsValue } from "../handlers/statsProcessor";
import { fetchPrices } from "../services/datasource";

const currentBids = new Set();

export const searchTransferMarket = function (buyerSetting) {
  return new Promise((resolve) => {
    const expiresIn = convertToSeconds(buyerSetting["idAbItemExpiring"]);
    const useRandMinBid = buyerSetting["idAbRandMinBidToggle"];
    const useRandMinBuy = buyerSetting["idAbRandMinBuyToggle"];
    const futBinBuyPercent = buyerSetting["idBuyFutBinPercent"] || 100;
    let currentPage = getValue("currentPage") || 1;
    const currentSearchPerMin = getStatsValue("searchPerMinuteCount");
    if (
      currentSearchPerMin > 15 &&
      (buyerSetting["idAbOverSearchWarning"] ||
        buyerSetting["idAbOverSearchWarning"] === undefined)
    ) {
      writeToLog("--------------------", idProgressAutobuyer);
      writeToLog(
        "!!! More than 15 searches performed in last minute, increase your wait time",
        idProgressAutobuyer
      );
      writeToLog("--------------------", idProgressAutobuyer);
    }
    const playersList = new Set(
      (buyerSetting["idAddIgnorePlayersList"] || []).map(({ id }) => id)
    );
    const dataSource = getDataSource();
    let bidPrice = buyerSetting["idAbMaxBid"];
    let userBuyNowPrice = buyerSetting["idAbBuyPrice"];
    let useFutBinPrice =
      buyerSetting["idBuyFutBinPrice"] || buyerSetting["idAbBidFutBin"];

    if (!userBuyNowPrice && !bidPrice && !useFutBinPrice) {
      writeToLog(
        "skip search >>> (No Buy or Bid Price given)",
        idProgressAutobuyer
      );
      return resolve();
    }

    sendPinEvents("Transfer Market Search");
    updateRequestCount();
    let searchCriteria = this._viewmodel.searchCriteria;
    if (useRandMinBid)
      searchCriteria.minBid = roundOffPrice(
        getRandNum(0, buyerSetting["idAbRandMinBidInput"])
      );
    if (useRandMinBuy)
      searchCriteria.minBuy = roundOffPrice(
        getRandNum(0, buyerSetting["idAbRandMinBuyInput"])
      );
    services.Item.clearTransferMarketCache();

    services.Item.searchTransferMarket(searchCriteria, currentPage).observe(
      this,
      async function (sender, response) {
        if (response.success) {
          setValue("searchFailedCount", 0);
          let validSearchCount = true;
          writeToLog(
            `Found ${response.data.items.length} items, page - ${currentPage} => (minbid: ${searchCriteria.minBid} minbuy:${searchCriteria.minBuy})`,
            idProgressAutobuyer
          );

          if (response.data.items.length > 0) {
            writeToLog("--------------------", idProgressAutobuyer);
            currentPage === 1 &&
              sendPinEvents("Transfer Market Results - List View");
            if (useFutBinPrice && response.data.items[0].type === "player") {
              await fetchPrices(response.data.items);
            }
          }

          if (response.data.items.length > buyerSetting["idAbSearchResult"]) {
            validSearchCount = false;
          }

          let maxPurchases = buyerSetting["idAbMaxPurchases"] || 1;

          if (buyerSetting["idAbShouldSort"])
            response.data.items = sortPlayers(
              response.data.items,
              buyerSetting["idAbSortBy"] || "buy",
              buyerSetting["idAbSortOrder"]
            );
          for (
            let i = response.data.items.length - 1;
            i >= 0 && getValue("autoBuyerActive");
            i--
          ) {
            let player = response.data.items[i];
            let auction = player._auction;
            let expires = services.Localization.localizeAuctionTimeRemaining(
              auction.expires
            );
            let type = player.type;
            let { id } = player._metaData || {};
            let playerRating = parseInt(player.rating);

            if (useFutBinPrice && type === "player") {
              const existingValue = getValue(
                `${player.definitionId}_${dataSource.toLowerCase()}_price`
              );
              if (existingValue && existingValue.price) {
                const futBinBuyPrice = roundOffPrice(
                  (existingValue.price * futBinBuyPercent) / 100
                );
                userBuyNowPrice = futBinBuyPrice;
                if (buyerSetting["idAbBidFutBin"]) {
                  bidPrice = futBinBuyPrice;
                }
              } else {
                writeToLog(
                  `Price unavailable for ${player._staticData.name}`,
                  idProgressAutobuyer
                );
                continue;
              }
            }

            let buyNowPrice = auction.buyNowPrice;
            let currentBid = auction.currentBid || auction.startingBid;
            let isBid = auction.currentBid;

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

            let usersellPrice = buyerSetting["idAbSellPrice"];
            let minRating = buyerSetting["idAbMinRating"];
            let maxRating = buyerSetting["idAbMaxRating"];
            let playerName = player._staticData.name;

            const shouldCheckRating = minRating || maxRating;

            const isValidRating =
              !shouldCheckRating ||
              checkRating(playerRating, minRating, maxRating);

            const logWrite = writeToLogClosure(
              `${playerName}(${playerRating}) Price: ${buyNowPrice} time: ${expires}`
            );

            if (
              (!buyerSetting["idAbIgnoreAllowToggle"] && playersList.has(id)) ||
              (buyerSetting["idAbIgnoreAllowToggle"] && !playersList.has(id))
            ) {
              logWrite("(Ignored player)");
              continue;
            }

            if (!validSearchCount) {
              logWrite("(Exceeded search result threshold)");
              continue;
            }

            if (maxPurchases < 1) {
              logWrite("(Exceeded num of buys/bids per search)");
              break;
            }

            if (!player.preferredPosition && buyerSetting["idAbAddFilterGK"]) {
              logWrite("(is a Goalkeeper)");
              continue;
            }

            if (!isValidRating) {
              logWrite("(rating does not fit criteria)");
              continue;
            }

            if (currentBids.has(auction.tradeId)) {
              logWrite("(Cached Item)");
              continue;
            }

            const userCoins = services.User.getUser().coins.amount;
            if (
              (!bidPrice && userCoins < buyNowPrice) ||
              (bidPrice && userCoins < checkPrice)
            ) {
              logWrite("(Insufficient coins to buy/bid)");
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
                true,
                auction.tradeId
              );
              continue;
            }

            if (bidPrice && currentBid <= priceToBid) {
              if (auction.expires > expiresIn) {
                logWrite("(Waiting for specified expiry time)");
                continue;
              }
              logWrite("attempt bid: " + checkPrice);
              currentBids.add(auction.tradeId);
              maxPurchases--;
              await buyPlayer(
                player,
                playerName,
                checkPrice,
                usersellPrice,
                checkPrice === buyNowPrice,
                auction.tradeId
              );
              continue;
            }

            if (
              (userBuyNowPrice && buyNowPrice > userBuyNowPrice) ||
              (bidPrice && currentBid > priceToBid)
            ) {
              logWrite(
                `BuyPrice: ${
                  userBuyNowPrice || priceToBid
                } (higher than specified buy/bid price)`
              );
              continue;
            }
            logWrite("(No Actions Required)");
          }
        } else {
          searchErrorHandler(
            response,
            buyerSetting["idAbSolveCaptcha"],
            buyerSetting["idAbCloseTabToggle"]
          );
        }
        sendPinEvents("Transfer Market Search");

        if (
          currentPage < buyerSetting["idAbMaxSearchPage"] &&
          response.data.items.length === 21
        ) {
          increAndGetStoreValue("currentPage");
        } else {
          setValue("currentPage", 1);
        }
        resolve();
      }
    );
  });
};

const writeToLogClosure = (playerName) => {
  return (actionTxt) => {
    writeToLog(playerName + " " + actionTxt, idProgressAutobuyer);
  };
};

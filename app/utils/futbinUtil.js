import { idAutoBuyerFoundLog } from "../elementIds.constants";
import { getValue, setValue } from "../services/repository";
import { networkCallWithRetry } from "./commonUtil";
import { writeToLog } from "./logUtil";
import { getBuyBidPrice, roundOffPrice } from "./priceUtils";
import { getUserPlatform } from "./userUtil";

export const fetchPricesFromFutBin = (definitionId, retries) => {
  return networkCallWithRetry(
    fetchPrices.bind(null, definitionId),
    0.5,
    retries
  );
};

export const fetchPricesBulkFromFutBin = (definitionId, refIds, retries) => {
  return networkCallWithRetry(
    fetchPrices.bind(null, definitionId, refIds),
    0.5,
    retries
  );
};

export const getSellPriceFromFutBin = async (
  buyerSetting,
  playerName,
  player
) => {
  let sellPrice;
  try {
    const definitionId = player.definitionId;
    if (player.type !== "player") {
      return sellPrice;
    }
    await addFutbinCachePrice([player]);
    const existingValue = getValue(definitionId);
    if (existingValue && existingValue.price) {
      sellPrice = existingValue.price;
      const futBinPercent = buyerSetting["idSellFutBinPercent"] || 100;
      let calculatedPrice = (sellPrice * futBinPercent) / 100;
      await getPriceLimits(player);
      if (player.hasPriceLimits()) {
        calculatedPrice = roundOffPrice(
          Math.min(
            player._itemPriceLimits.maximum,
            Math.max(player._itemPriceLimits.minimum, calculatedPrice)
          )
        );

        if (calculatedPrice === player._itemPriceLimits.minimum) {
          calculatedPrice = getBuyBidPrice(calculatedPrice);
        }
      }
      calculatedPrice = roundOffPrice(calculatedPrice);
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
  return sellPrice;
};

export const addFutbinCachePrice = async (players) => {
  const platform = getUserPlatform();
  const playerIds = new Set();
  const playersLookup = [];
  for (const player of players) {
    const existingValue = getValue(player.definitionId);
    if (!existingValue) {
      playerIds.add(player.definitionId);
      playersLookup.push(player);
    }
  }
  if (playerIds.size) {
    const playersArray = Array.from(playerIds);
    while (playersArray.length) {
      const playersIdArray = playersArray.splice(0, 30);
      const playerId = playersIdArray.shift();
      const refIds = playersIdArray.join(",");
      try {
        const futBinResponse = await fetchPricesBulkFromFutBin(
          playerId,
          refIds,
          3
        );
        if (futBinResponse.status === 200) {
          const futBinPrices = JSON.parse(futBinResponse.responseText);
          for (let player of playersLookup) {
            if (futBinPrices[player.definitionId]) {
              const futbinLessPrice =
                futBinPrices[player.definitionId].prices[platform].LCPrice;
              const cacheValue = {
                expiryTimeStamp: new Date(Date.now() + 15 * 60 * 1000),
                price: parseInt(futbinLessPrice.replace(/[,.]/g, "")),
              };
              setValue(player.definitionId, cacheValue);
            }
          }
        }
      } catch (err) {}
    }
  }
};

const fetchPrices = (definitionId, refIds) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://www.futbin.com/22/playerPrices?player=${definitionId}&rids=${refIds}`,
      onload: (res) => {
        if (res.status === 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
    });
  });
};

const getPriceLimits = async (player) => {
  return new Promise((resolve) => {
    if (player.hasPriceLimits()) {
      resolve();
      return;
    }
    services.Item.requestMarketData(player).observe(
      this,
      async function (sender, response) {
        resolve();
      }
    );
  });
};

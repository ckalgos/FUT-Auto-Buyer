import { idAutoBuyerFoundLog } from "../elementIds.constants";
import { fetchPrices } from "../services/futbin";
import { getValue } from "../services/repository";
import { getRandNumberInRange } from "./commonUtil";
import { writeToLog } from "./logUtil";
import { getBuyBidPrice, roundOffPrice } from "./priceUtils";

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
    await fetchPrices([player]);
    const existingValue = getValue(definitionId);
    if (existingValue && existingValue.price) {
      sellPrice = existingValue.price;
      const futBinPercent =
        getRandNumberInRange(buyerSetting["idSellFutBinPercent"]) || 100;
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

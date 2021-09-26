import { idAutoBuyerFoundLog } from "../elementIds.constants";
import { getValue, setValue } from "../services/repository";
import { networkCallWithRetry } from "./commonUtil";
import { writeToLog } from "./logUtil";
import { roundOffPrice } from "./priceUtils";
import { getUserPlatform } from "./userUtil";

export const fetchPricesFromFutBin = (definitionId, retries) => {
  if (getValue(definitionId)) {
    return new Promise((resolve, reject) => {
      resolve(getValue(definitionId));
    });
  }
  return networkCallWithRetry(
    fetchPrices.bind(null, definitionId),
    0.5,
    retries
  );
};

export const getSellPriceFromFutBin = async (
  buyerSetting,
  playerName,
  definitionId
) => {
  let sellPrice;
  try {
    const futBinResponse = await fetchPricesFromFutBin(definitionId, 3);
    if (futBinResponse.status === 200) {
      const futBinPrices = JSON.parse(futBinResponse.responseText);
      sellPrice = parseInt(
        futBinPrices[definitionId].prices[getUserPlatform()].LCPrice.replace(
          /[,.]/g,
          ""
        )
      );
      const futBinPercent = buyerSetting["idSellFutBinPercent"];
      const calculatedPrice = roundOffPrice((sellPrice * futBinPercent) / 100);
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

const fetchPrices = (definitionId) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://www.futbin.com/22/playerPrices?player=${definitionId}`,
      onload: (res) => {
        if (res.status === 200) {
          res.expiryTimeStamp = new Date(Date.now() + 15 * 60 * 1000);
          setValue(definitionId, res);
          resolve(res);
        } else {
          reject(res);
        }
      },
    });
  });
};

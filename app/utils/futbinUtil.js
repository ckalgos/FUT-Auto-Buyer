import { getValue, setValue } from "../services/repository";
import { networkCallWithRetry } from "./commonUtil";

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

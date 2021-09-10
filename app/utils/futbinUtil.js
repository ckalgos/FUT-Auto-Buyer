import { getValue, setValue } from "../services/repository";
import { networkCallWithRetry } from "./commonUtil";

export const fetchPricesFromFutBin = (resourceId, retries) => {
  if (getValue(resourceId)) {
    return new Promise((resolve, reject) => {
      resolve(getValue(resourceId));
    });
  }
  return networkCallWithRetry(fetchPrices.bind(null, resourceId), 0.5, retries);
};

const fetchPrices = (resourceId) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://www.futbin.com/21/playerPrices?player=${resourceId}`,
      onload: (res) => {
        if (res.status === 200) {
          res.expiryTimeStamp = new Date(Date.now() + 15 * 60 * 1000);
          setValue(resourceId, res);
          resolve(res);
        } else {
          reject(res);
        }
      },
    });
  });
};

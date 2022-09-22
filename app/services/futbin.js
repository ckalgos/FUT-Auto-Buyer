import { getCardName } from "../utils/futItemUtil";
import { sendRequest } from "../utils/networkUtil";
import { getUserPlatform } from "../utils/userUtil";
import { getValue, setValue } from "./repository";

const supportedConsumables = new Set(["Position", "Chemistry Style"]);

export const fetchPrices = async (items) => {
  const result = new Map();

  const missingPlayerIds = new Set();
  const missingConsumables = new Map();

  for (const item of items) {
    if (!item.definitionId) {
      continue;
    }

    const priceDetail = getValue(item.definitionId);
    if (priceDetail) {
      result.set(item.definitionId, priceDetail.price);
    } else if (item.isPlayer()) {
      missingPlayerIds.add(item.definitionId);
    } else if (
      item.isTraining() &&
      supportedConsumables.has(item._staticData.name)
    ) {
      if (!missingConsumables.has(item._staticData.name)) {
        missingConsumables.set(item._staticData.name, []);
      }
      missingConsumables.get(item._staticData.name).push({
        definitionId: item.definitionId,
        subType: getCardName(item),
      });
    }
  }

  const pendingPromises = [];

  if (missingPlayerIds.size) {
    pendingPromises.push(fetchPlayerPrices(missingPlayerIds, result));
  }

  if (missingConsumables.size) {
    pendingPromises.push(fetchConsumablesPrices(missingConsumables, result));
  }
  await Promise.all(pendingPromises);

  return result;
};

const fetchPlayerPrices = async (playerIds, result) => {
  const idsArray = Array.from(playerIds);
  const platform = getUserPlatform();
  while (idsArray.length) {
    const playersIdArray = idsArray.splice(0, 30);
    const primaryId = playersIdArray.shift();
    if (!primaryId) {
      continue;
    }
    const refIds = playersIdArray.join(",");
    try {
      const futBinResponse = await sendRequest(
        `https://www.futbin.com/23/playerPrices?player=${primaryId}&rids=${refIds}`,
        "GET",
        `${Math.floor(+new Date())}_fetchPlayerPrices`
      );

      const priceResponse = JSON.parse(futBinResponse);

      for (const id of [primaryId, ...playersIdArray]) {
        const lcPrice = priceResponse[id].prices[platform].LCPrice;
        if (!lcPrice) {
          continue;
        }
        const cardPrice = parseInt(lcPrice.replace(/[,.]/g, ""));

        const cacheValue = {
          expiryTimeStamp: new Date(Date.now() + 15 * 60 * 1000),
          price: cardPrice,
        };
        setValue(id, cacheValue);
        result.set(id, cardPrice);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const fetchConsumablesPrices = async (missingConsumables, result) => {
  const platform = getUserPlatform();
  const futBinPlatform =
    platform === "ps" ? "PS" : platform === "xbox" ? "XB" : "PC";
  const consumableTypes = Array.from(missingConsumables.keys());
  for (const consumableType of consumableTypes) {
    try {
      const category = consumableType.split(" ")[0];
      const futBinResponse = await sendRequest(
        `https://www.futbin.org/futbin/api/fetchConsumables?category=${category}&platformtype=${futBinPlatform}`,
        "GET",
        `${Math.floor(+new Date())}_fetchConsumablesPrices`
      );

      const priceResponse = JSON.parse(futBinResponse);
      const consumablesPriceLookUp = priceResponse.data.reduce((acc, curr) => {
        acc.set(curr.SubType.toUpperCase(), curr.LCPrice);
        return acc;
      }, new Map());
      const consumableCards = missingConsumables.get(consumableType) || [];
      for (const { definitionId, subType } of consumableCards) {
        let cardPrice = consumablesPriceLookUp.get(subType);
        if (cardPrice) {
          const cacheValue = {
            expiryTimeStamp: new Date(Date.now() + 15 * 60 * 1000),
            price: cardPrice,
          };
          setValue(definitionId, cacheValue);
          result.set(definitionId, cardPrice);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

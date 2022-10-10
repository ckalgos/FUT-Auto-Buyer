import { sendRequest } from "../../utils/networkUtil";
import { getUserPlatform } from "../../utils/userUtil";
import { sendExternalRequest } from "../externalRequest";
import { getValue, setValue } from "../repository";

const fetchPrices = async (items) => {
  const result = new Map();

  const missingPlayers = new Map();

  let pendingPromises = [];
  for (const item of items) {
    if (!item.definitionId) {
      continue;
    }

    const priceDetail = getValue(`${item.definitionId}_futwiz_price`);
    if (priceDetail) {
      result.set(`${item.definitionId}_futwiz_price`, priceDetail.price);
    } else if (item.isPlayer()) {
      missingPlayers.set(item.definitionId, item);
    }
  }

  if (missingPlayers.size) {
    for (const item of missingPlayers.values())
      pendingPromises.push(getPlayerPrices(item, result));
  }
  await Promise.all(pendingPromises);

  return result;
};

const getPlayerPrices = async (player, result) => {
  try {
    const filteredPlayer = await getMatchingPlayer(player);
    const platform = getUserPlatform();
    if (!filteredPlayer) {
      return;
    }
    const futWizResponse = await sendRequest(
      `https://www.futwiz.com/en/app/sold23/${filteredPlayer[0].lineid}/console`,
      "GET",
      `${player.definitionId}_fetchFutWizPlayerPrices`
    );
    const priceResponse = JSON.parse(futWizResponse);
    let price = priceResponse.prices[platform].bin;

    if (platform === "ps" && !price) {
      price = priceResponse.prices["xb"].bin;
    }

    const cardPrice = parseInt(price.replace(/[,.]/g, ""));

    const cacheKey = `${player.definitionId}_futwiz_price`;
    const cacheValue = {
      expiryTimeStamp: new Date(Date.now() + 15 * 60 * 1000),
      price: cardPrice,
    };

    setValue(cacheKey, cacheValue);
    result.set(cacheKey, cardPrice);
  } catch (err) {
    console.log(err);
  }
};

const getMatchingPlayer = (item) => {
  return new Promise((resolve, reject) => {
    const playerName = TextUtils.stripSpecialCharacters(
      item._staticData.knownAs !== "---"
        ? item._staticData.knownAs
        : item._staticData.name
    );
    sendExternalRequest({
      url: `https://www.futwiz.com/en/searches/player23/${playerName}`,
      method: "GET",
      identifier: `${item.definitionId}_getFutWizPlayerUrl`,
      onload: (res) => {
        if (res.status !== 200) {
          return resolve();
        }
        const players = JSON.parse(res.response);

        if (!players) {
          return resolve();
        }

        let filteredPlayers = players.filter(
          (p) => parseInt(p.rating) === item.rating
        );

        if (players && !filteredPlayers.length) {
          filteredPlayers = players;
        }

        if (filteredPlayers && filteredPlayers.length > 1) {
          filteredPlayers = filteredPlayers.filter(
            (p) =>
              p.rare === item.rareflag.toString() && p.club === item.teamId + ""
          );
        }
        resolve(filteredPlayers);
      },
    });
  });
};

export default {
  fetchPrices,
};

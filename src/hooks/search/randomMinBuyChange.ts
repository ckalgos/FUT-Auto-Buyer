import { InMemoryStore } from "../../classes/InMemoryStore";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";
import { getRandomNumberInRange } from "../../utils/mathUtil";
import { roundOffPrice } from "../../utils/priceUtil";

export const randomMinBuyChange = (searchCriteria: UTSearchCriteria) => {
  const store = InMemoryStore.getInstance();
  const { useRandomMinBuy, randomMinBuy } = store.get("search-setting");
  if (useRandomMinBuy && randomMinBuy) {
    searchCriteria.minBuy = roundOffPrice(
      getRandomNumberInRange(0, randomMinBuy)
    );
  }
  return null;
};

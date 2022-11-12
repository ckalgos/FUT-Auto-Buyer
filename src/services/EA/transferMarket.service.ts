import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";
import { observableToPromise } from "../../utils/observableToPromise";

export const searchTransferMarket = async (
  options: UTSearchCriteria
): Promise<UTItem[]> => {
  services.Item.clearTransferMarketCache();
  const response = await observableToPromise(
    services.Item.searchTransferMarket(options, 1)
  );
  return response.items;
};

export const bidItem = async (
  item: UTItem,
  coins: number
): Promise<boolean> => {
  await observableToPromise(services.Item.bid(item, coins));
  return true;
};

export const listItem = async (item: UTItem, sellPrice: number) => {
  await observableToPromise(
    services.Item.list(
      item,
      UTCurrencyInputControl.getIncrementBelowVal(sellPrice),
      sellPrice,
      3600
    )
  );
  return true;
};

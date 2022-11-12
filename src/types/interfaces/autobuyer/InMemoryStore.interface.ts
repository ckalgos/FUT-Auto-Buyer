import { AutobuyerCache } from "./AutoBuyerCache.interface";
import { BuySetting } from "./settings/BuySetting.interface";
import { SearchSetting } from "./settings/SearchSetting.interface";
import { SellSetting } from "./settings/SellSetting.interface";

export type InMemoryStoreType = {
  ["buy-setting"]: BuySetting;
  ["sell-setting"]: SellSetting;
  ["search-setting"]: SearchSetting;
  ["autobuyer-cache"]: AutobuyerCache;
};

export type InMemoryStoreKeyType = keyof InMemoryStoreType;

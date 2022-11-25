import { AutobuyerCache } from "./AutoBuyerCache.interface";
import { BuySetting } from "./settings/BuySetting.interface";
import { SearchSetting } from "./settings/SearchSetting.interface";
import { SellSetting } from "./settings/SellSetting.interface";
import { Stats } from "./stats/Stats.interface";

export type InMemoryStoreType = {
  ["buy-setting"]: BuySetting;
  ["sell-setting"]: SellSetting;
  ["search-setting"]: SearchSetting;
  ["autobuyer-cache"]: AutobuyerCache;
  ["stats"]: Stats;
};

export type InMemoryStoreKeyType = keyof InMemoryStoreType;

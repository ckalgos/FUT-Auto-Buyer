import {
  InMemoryStoreKeyType,
  InMemoryStoreType,
} from "../types/interfaces/autobuyer/InMemoryStore.interface";

export class InMemoryStore {
  private static __instance: InMemoryStore;
  private __entries: InMemoryStoreType;

  private constructor() {
    this.__entries = this.getDefaultState();
  }

  private getDefaultState(): InMemoryStoreType {
    return Object.freeze<InMemoryStoreType>({
      "buy-setting": Object.seal({
        buyPrice: 0,
        bidPrice: 0,
        noOfCards: 0,
        bidExactPrice: false,
      }),
      "sell-setting": Object.seal({ sellPrice: 0 }),
      "search-setting": Object.seal({
        randomMinBuy: 300,
        useRandomMinBuy: true,
        runForeGround: false,
      }),
      "autobuyer-cache": Object.seal({
        cachedBids: new Set<number>(),
      }),
      stats: Object.seal({
        soldItems: 0,
        unsoldItems: 0,
        activeTransfers: 0,
        availableItems: 0,
        coinsNumber: 0,
        searchCount: 0,
        profit: 0,
        searchPerMinuteCount: 0,
        purchasedCardCount: 0,
      }),
    });
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new InMemoryStore();
    }
    return this.__instance;
  }

  has(key: InMemoryStoreKeyType) {
    return !!this.__entries[key];
  }

  get<K extends InMemoryStoreKeyType>(key: K): InMemoryStoreType[K] {
    return this.__entries[key];
  }

  getDefault<K extends InMemoryStoreKeyType>(key: K): InMemoryStoreType[K] {
    return this.getDefaultState()[key];
  }

  clear<K extends InMemoryStoreKeyType>(key: K) {
    this.__entries[key] = this.getDefault(key);
  }
}

import {
  InMemoryStoreKeyType,
  InMemoryStoreType,
} from "../types/interfaces/autobuyer/InMemoryStore.interface";

export class InMemoryStore {
  static __instance: InMemoryStore;

  entries: InMemoryStoreType;
  private constructor() {
    this.entries = this.getDefaultState();
  }

  private getDefaultState(): InMemoryStoreType {
    return {
      "buy-setting": {},
      "sell-setting": {},
      "search-setting": {
        randomMinBuy: 300,
        useRandomMinBuy: true,
      },
      "autobuyer-cache": {
        cachedBids: new Set(),
      },
    };
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new InMemoryStore();
    }
    return this.__instance;
  }

  has(key: InMemoryStoreKeyType) {
    return !!this.entries[key];
  }

  delete(key: InMemoryStoreKeyType) {
    return delete this.entries[key];
  }

  set<T extends {}>(key: InMemoryStoreKeyType, value: T) {
    return (this.entries[key] = value);
  }

  get<K extends InMemoryStoreKeyType>(key: K): InMemoryStoreType[K] {
    return this.entries[key];
  }

  clear() {
    return (this.entries = this.getDefaultState());
  }
}

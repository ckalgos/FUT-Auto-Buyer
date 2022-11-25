import { InMemoryStore } from "../classes/InMemoryStore";
import { BackGroundTransferOrchestrator } from "../classes/transfer/BackGroundTransferOrchestrator";
import { ForeGroundTransferOrchestrator } from "../classes/transfer/ForeGroundTransferOrchestrator";
import { TransferOrchestrator } from "../classes/transfer/TransferOrchestrator";
import { SearchSetting } from "../types/interfaces/autobuyer/settings/SearchSetting.interface";

export class TransferFactory {
  private static __instance: TransferFactory;
  private instanceLookUp: Map<Number, TransferOrchestrator>;
  private searchSetting: SearchSetting;
  private constructor() {
    this.instanceLookUp = new Map<Number, TransferOrchestrator>();
    this.instanceLookUp.set(0, new BackGroundTransferOrchestrator());
    this.instanceLookUp.set(1, new ForeGroundTransferOrchestrator());

    this.searchSetting = InMemoryStore.getInstance().get("search-setting");
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new TransferFactory();
    }
    return this.__instance;
  }

  getTransferOrchestrator() {
    const key = this.searchSetting.runForeGround ? 1 : 0;
    return this.instanceLookUp.get(key)!;
  }
}

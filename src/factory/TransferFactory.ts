import { InMemoryStore } from "../classes/InMemoryStore";
import { BackGroundTransferOrchestrator } from "../classes/transfer/BackGroundTransferOrchestrator";
import { ForeGroundTransferOrchestrator } from "../classes/transfer/ForeGroundTransferOrchestrator";
import { TransferOrchestrator } from "../classes/transfer/TransferOrchestrator";

export class TransferFactory {
  private static __instance: TransferFactory;
  private instanceLookUp: Map<Number, TransferOrchestrator>;
  private constructor() {
    this.instanceLookUp = new Map<Number, TransferOrchestrator>();
    this.instanceLookUp.set(0, new BackGroundTransferOrchestrator());
    this.instanceLookUp.set(1, new ForeGroundTransferOrchestrator());
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new TransferFactory();
    }
    return this.__instance;
  }

  getTransferOrchestrator() {
    const key = InMemoryStore.getInstance().get("search-setting").runForeGround
      ? 1
      : 0;
    return this.instanceLookUp.get(key)!;
  }
}

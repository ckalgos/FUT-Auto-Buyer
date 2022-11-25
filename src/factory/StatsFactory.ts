import { PhoneStatsProcessor } from "../processors/stats/PhoneStatsProcessor";
import { StatsProcessor } from "../processors/stats/StatsProcessor";
import { WebStatsProcessor } from "../processors/stats/WebStatsProcessor";

export class StatsFactory {
  private static __instance: StatsFactory;
  private __statsInstance: StatsProcessor;

  constructor() {
    this.__statsInstance = isPhone()
      ? new PhoneStatsProcessor()
      : new WebStatsProcessor();
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new StatsFactory();
    }
    return this.__instance;
  }

  getProcessor() {
    return this.__statsInstance;
  }
}

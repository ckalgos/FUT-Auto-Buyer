import { Stats } from "../../types/interfaces/autobuyer/stats/Stats.interface";
import { InMemoryStore } from "../../classes/InMemoryStore";
import { Timer } from "../../classes/Timer";

export abstract class StatsProcessor {
  private __stats: Stats;
  private interval: Timer | null = null;
  constructor() {
    this.__stats = InMemoryStore.getInstance().get("stats");
  }
  abstract Process(): void;

  updateStat<K extends keyof Stats>(key: K, value: Stats[K]) {
    this.__stats[key] = value;
  }

  incrementStat<K extends keyof Stats>(key: K, incrementBy: number = 1) {
    this.updateStat(key, (this.getStats()[key] || 0) + incrementBy);
  }

  setInitialValues() {
    this.updateStat("purchasedCardCount", 0);
  }

  getStats(): Stats {
    return this.__stats;
  }

  start() {
    this.interval = new Timer(this.Process.bind(this), 1, 1);
    this.interval.run();
  }

  stop() {
    this.interval?.stop();
    this.setInitialValues();
  }
}

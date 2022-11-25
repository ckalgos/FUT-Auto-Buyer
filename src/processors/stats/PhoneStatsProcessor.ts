import { StatsProcessor } from "./StatsProcessor";

export class PhoneStatsProcessor extends StatsProcessor {
  constructor() {
    super();
  }

  Process(): void {
    console.log("Date Phone", Date.now());
  }
}

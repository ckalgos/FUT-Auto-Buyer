import { StatsProcessor } from "./StatsProcessor";

export class WebStatsProcessor extends StatsProcessor {
  constructor() {
    super();
  }

  Process(): void {
    console.log("Date", Date.now());
  }
}

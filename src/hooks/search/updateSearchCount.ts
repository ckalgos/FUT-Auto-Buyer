import { StatsFactory } from "../../factory/StatsFactory";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";

export const updateSearchCount = (_: UTSearchCriteria) => {
  const statsProcessor = StatsFactory.getInstance().getProcessor();
  statsProcessor.incrementStat("searchCount");
};

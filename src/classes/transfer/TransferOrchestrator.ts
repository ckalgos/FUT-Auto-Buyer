import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";

export abstract class TransferOrchestrator {
  abstract searchMarket(
    searchCriteria: UTSearchCriteria
  ): Promise<UTItem[] | undefined | void>;

  abstract handleTransferResults(items: UTItem[]): Promise<UTItem | undefined>;

  abstract handleWonItem(item: UTItem): Promise<void>;
}

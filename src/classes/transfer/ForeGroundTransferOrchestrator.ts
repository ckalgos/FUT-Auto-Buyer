import { handleWonItemFG } from "../../services/autobuyer/foreground/handleWonItems.service";
import { handleTransferResultsFG } from "../../services/autobuyer/foreground/transferResult.service";
import { searchMarketFG } from "../../services/autobuyer/foreground/transferSearch.service";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";
import { TransferOrchestrator } from "./TransferOrchestrator";

export class ForeGroundTransferOrchestrator implements TransferOrchestrator {
  async searchMarket(searchCriteria: UTSearchCriteria) {
    return searchMarketFG(searchCriteria);
  }

  async handleTransferResults(items: UTItem[]) {
    return handleTransferResultsFG(items);
  }

  handleWonItem(item: UTItem): Promise<void> {
    return handleWonItemFG(item);
  }
}

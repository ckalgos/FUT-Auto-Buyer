import { handleWonItemBG } from "../../services/autobuyer/background/handleWonItems.service";
import { handleTransferResultsBG } from "../../services/autobuyer/background/transferResult.service";
import { searchMarketBG } from "../../services/autobuyer/background/transferSearch.service";
import { UTItem } from "../../types/interfaces/item/UTItem.interface";
import { UTSearchCriteria } from "../../types/interfaces/search/UTSearchCriteria.interface";
import { TransferOrchestrator } from "./TransferOrchestrator";

export class BackGroundTransferOrchestrator implements TransferOrchestrator {
  async searchMarket(searchCriteria: UTSearchCriteria) {
    return searchMarketBG(searchCriteria);
  }

  async handleTransferResults(items: UTItem[]) {
    return handleTransferResultsBG(items);
  }

  handleWonItem(item: UTItem): Promise<void> {
    return handleWonItemBG(item);
  }
}

import { UTSearchCriteria } from "../../../types/interfaces/search/UTSearchCriteria.interface";
import { sendPinEvents } from "../../EA/pinEvents.service";
import { searchTransferMarket } from "../../EA/transferMarket.service";
import { runSearchHooks } from "../../../hooks/search/runSearchHooks";
import { Logger } from "../../../classes/Logger";
import { UINotificationTypeEnum } from "../../../types/enums/enums";

export const searchMarketBG = async (searchCriteria: UTSearchCriteria) => {
  const errorMessage = runSearchHooks(searchCriteria);
  if (errorMessage) {
    Logger.writeToLog(errorMessage, UINotificationTypeEnum.NEGATIVE);
    return;
  }

  sendPinEvents("Hub - Transfers");
  const transferResult = await searchTransferMarket(searchCriteria);
  return transferResult;
};

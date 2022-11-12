import { InMemoryStore } from "../../../classes/InMemoryStore";
import { Logger } from "../../../classes/Logger";
import { runBidHooks } from "../../../hooks/bid/runBidHooks";
import { UINotificationTypeEnum } from "../../../types/enums/enums";
import { UTItem } from "../../../types/interfaces/item/UTItem.interface";
import { sendPinEvents } from "../../EA/pinEvents.service";
import { bidItem } from "../../EA/transferMarket.service";

export const handleTransferResultsBG = async (items: UTItem[]) => {
  if (items.length) {
    sendPinEvents("Transfer Market Results - List View");
    const store = InMemoryStore.getInstance();
    const buyerSetting = store.get("buy-setting");
    for (const item of items) {
      const errorMessage = runBidHooks(item);
      if (errorMessage) {
        Logger.writeToLog(errorMessage, UINotificationTypeEnum.NEGATIVE);
        continue;
      }
      const isSuccess = await bidItem(item, item._auction.buyNowPrice).catch(
        (err) => {
          Logger.writeToLog("Buy Failed", UINotificationTypeEnum.NEGATIVE);
        }
      );

      if (isSuccess) {
        Logger.writeToLog(
          `Buy Success ${buyerSetting.buyPrice}`,
          UINotificationTypeEnum.POSITIVE
        );
        return item;
      }

      break;
    }
  }
};

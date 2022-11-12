import { InMemoryStore } from "../../../classes/InMemoryStore";
import { NotificationOrchestrator } from "../../../classes/notification/NotificationOrchestrator";
import { runBidHooks } from "../../../hooks/bid/runBidHooks";
import { UINotificationTypeEnum } from "../../../types/enums/enums";
import { UTItem } from "../../../types/interfaces/item/UTItem.interface";
import { wait } from "../../../utils/commonUtil";
import { bidItem } from "../../EA/transferMarket.service";

export const handleTransferResultsFG = async (items: UTItem[]) => {
  if (items.length) {
    const notificationInstance = NotificationOrchestrator.getInstance();
    const store = InMemoryStore.getInstance();
    const buyerSetting = store.get("buy-setting");

    for (const item of items) {
      const errorMessage = runBidHooks(item);
      if (errorMessage) {
        notificationInstance.notify(
          errorMessage,
          { ui: true },
          UINotificationTypeEnum.NEGATIVE
        );
        continue;
      }
      const isSuccess = await bidItem(item, item._auction.buyNowPrice).catch(
        (err) => {
          notificationInstance.notify(
            "Buy failed",
            {
              ui: true,
            },
            UINotificationTypeEnum.NEGATIVE
          );
        }
      );
      if (isSuccess) {
        notificationInstance.notify(
          `Buy Success ${buyerSetting.buyPrice}`,
          {
            ui: true,
          },
          UINotificationTypeEnum.POSITIVE
        );
        return item;
      }
      break;
    }
  }
};

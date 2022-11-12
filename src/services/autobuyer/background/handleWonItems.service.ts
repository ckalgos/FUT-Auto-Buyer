import { InMemoryStore } from "../../../classes/InMemoryStore";
import { Logger } from "../../../classes/Logger";
import { runSellHooks } from "../../../hooks/sell/runSellHooks";
import { UINotificationTypeEnum } from "../../../types/enums/enums";
import { UTItem } from "../../../types/interfaces/item/UTItem.interface";
import { move } from "../../EA/item.service";
import { listItem } from "../../EA/transferMarket.service";

export const handleWonItemBG = async (item: UTItem) => {
  const errorMessage = runSellHooks(item);
  if (errorMessage) {
    Logger.writeToLog(errorMessage, UINotificationTypeEnum.NEGATIVE);
    return;
  }

  const store = InMemoryStore.getInstance();
  const { sellPrice } = store.get("sell-setting");
  if (sellPrice) {
    await sellItem(item, sellPrice);
  } else {
    sendToClub(item);
  }
};

const sendToClub = async (item: UTItem) => {
  await move(item, ItemPile.CLUB);
  Logger.writeToLog("Moved to club");
};

const sellItem = async (item: UTItem, sellPrice: number) => {
  await listItem(item, sellPrice);
  Logger.writeToLog(`Listed for ${sellPrice}`, UINotificationTypeEnum.POSITIVE);
};

import { InMemoryStore } from "../../../classes/InMemoryStore";
import { NotificationOrchestrator } from "../../../classes/notification/NotificationOrchestrator";
import { runSellHooks } from "../../../hooks/sell/runSellHooks";
import { UINotificationTypeEnum } from "../../../types/enums/enums";
import { UTItem } from "../../../types/interfaces/item/UTItem.interface";
import { wait } from "../../../utils/commonUtil";
import {
  find,
  findByText,
  waitForElement,
  waitForElementToDisplay,
} from "../../../utils/UI/dom/dom.util";
import {
  dispatchChangeEvent,
  tap,
  tapElement,
} from "../../../utils/UI/dom/events.util";

export const handleWonItemFG = async (item: UTItem) => {
  const errorMessage = runSellHooks(item);
  const notificationInstance = NotificationOrchestrator.getInstance();
  if (errorMessage) {
    notificationInstance.notify(
      errorMessage,
      { ui: true },
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }
  const element = await waitForElement(".won");
  tapElement(element);
  await wait(0.3);

  const store = InMemoryStore.getInstance();
  const { sellPrice } = store.get("sell-setting");
  if (sellPrice) {
    await sellItem(sellPrice);
    notificationInstance.notify(
      `Listed for ${sellPrice}`,
      { ui: true },
      UINotificationTypeEnum.NEGATIVE
    );
  } else {
    sendToClub();
  }
};

const sendToClub = async () => {
  const sendToClubBtn = findByText(
    "button",
    services.Localization!.localize("infopanel.label.club")
  );
  if (sendToClubBtn) {
    tapElement(sendToClubBtn);
  } else {
    NotificationOrchestrator.getInstance().notify(
      "Cannot move - duplicate item",
      { ui: true },
      UINotificationTypeEnum.NEGATIVE
    );
  }
};

const sellItem = async (sellPrice: number) => {
  const quickListPanel = find(".ut-quick-list-panel-view");
  const listPanel = find(".accordian", quickListPanel!);
  listPanel && tapElement(listPanel);
  const buyNowPrice = findByText(
    ".spinnerLabel",
    services.Localization!.localize("auctioninfo.buynowprice")
  );
  const buyNowPriceInput = find(
    ".ut-number-input-control",
    buyNowPrice.parentElement!.parentElement!
  ) as HTMLInputElement;

  await waitForElementToDisplay(buyNowPriceInput);
  buyNowPriceInput.value = `${sellPrice}`;
  dispatchChangeEvent(buyNowPriceInput);
  await wait(0.3);
  tap(".call-to-action");
  await wait(0.3);
};

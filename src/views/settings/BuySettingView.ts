import { InMemoryStore } from "../../classes/InMemoryStore";
import { createNumericInput } from "../../utils/UI/EA/createNumericInput";
import { createToggleInput } from "../../utils/UI/EA/createToggleInput";

export const BuySettingView = () => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("buyer-settings-wrapper", "buy-settings-view");

  const store = InMemoryStore.getInstance();

  const buyerSetting = store.get("buy-setting");

  const buyPrice = createNumericInput(
    (value) => {
      buyerSetting.buyPrice = value || 0;
    },
    "Buy Price",
    false,
    buyerSetting.buyPrice,
    "buyer-settings-field"
  );

  const bidPrice = createNumericInput(
    (value) => {
      buyerSetting.bidPrice = value || 0;
    },
    "Bid Price",
    false,
    buyerSetting.bidPrice,
    "buyer-settings-field"
  );

  const numberOfCards = createNumericInput(
    (value) => {
      buyerSetting.noOfCards = value || 0;
    },
    "No. of cards to buy",
    true,
    buyerSetting.noOfCards,
    "buyer-settings-field"
  );

  const bidExactToggle = createToggleInput(
    "Bid Exact Price",
    (toggled) => {
      buyerSetting.bidExactPrice = toggled;
    },
    buyerSetting.bidExactPrice,
    "buyer-settings-field"
  );

  wrapperDiv.append(buyPrice);
  wrapperDiv.append(numberOfCards);
  wrapperDiv.append(bidPrice);
  wrapperDiv.append(bidExactToggle);

  return wrapperDiv;
};

import { InMemoryStore } from "../../classes/InMemoryStore";
import { createNumericInput } from "../../utils/UI/EA/createNumericInput";

export const BuySettingView = () => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("buyer-settings-wrapper", "buy-settings-view");

  const store = InMemoryStore.getInstance();

  const buyerSetting = store.get("buy-setting");

  const buyPrice = createNumericInput(
    (value) => {
      buyerSetting.buyPrice = value || 0;
      store.set("buy-setting", buyerSetting);
    },
    "Buy Price",
    buyerSetting.buyPrice,
    "buyer-settings-field"
  );

  wrapperDiv.append(buyPrice);

  return wrapperDiv;
};

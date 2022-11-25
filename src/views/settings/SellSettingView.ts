import { InMemoryStore } from "../../classes/InMemoryStore";
import { createNumericInput } from "../../utils/UI/EA/createNumericInput";

export const SellSettingView = () => {
  const wrapperDiv = document.createElement("div");

  wrapperDiv.classList.add("buyer-settings-wrapper", "sell-settings-view");

  const store = InMemoryStore.getInstance();

  const sellSetting = store.get("sell-setting");
  const sellPrice = createNumericInput(
    (value) => {
      sellSetting.sellPrice = value || 0;
    },
    "Sell Price",
    false,
    sellSetting.sellPrice,
    "buyer-settings-field"
  );

  wrapperDiv.append(sellPrice);

  return wrapperDiv;
};

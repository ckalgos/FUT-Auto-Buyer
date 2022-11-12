import { InMemoryStore } from "../../classes/InMemoryStore";
import { createNumericInput } from "../../utils/UI/EA/createNumericInput";
import { createTextInput } from "../../utils/UI/EA/createTextInput";

export const SellSettingView = () => {
  const wrapperDiv = document.createElement("div");

  wrapperDiv.classList.add("buyer-settings-wrapper", "sell-settings-view");

  const store = InMemoryStore.getInstance();

  const sellSetting = store.get("sell-setting");
  const sellPrice = createNumericInput(
    (value) => {
      sellSetting.sellPrice = value || 0;
      store.set("sell-setting", sellSetting);
    },
    "Sell Price",
    sellSetting.sellPrice,
    "buyer-settings-field"
  );

  wrapperDiv.append(sellPrice);

  return wrapperDiv;
};

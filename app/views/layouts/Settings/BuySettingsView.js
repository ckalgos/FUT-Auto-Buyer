import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const buySettingsView = function () {
  return `<div class='buyer-settings-wrapper buy-settings-view'>
      ${generateTextInput("Buy Price", "", { idAbBuyPrice }, "<br/>")}
      ${generateTextInput(
        "No. of cards to buy",
        10,
        { idAbCardCount },
        "(Works only with Buy price)"
      )}
      ${generateTextInput("Bid Price", "", { idAbMaxBid }, "<br/>")}
      ${generateTextInput(
        "Bid items expiring in",
        "1H",
        { idAbItemExpiring },
        "(S for seconds, M for Minutes, H for hours)",
        "text"
      )} 
      ${generateToggleInput("Bid Exact Price", { idAbBidExact }, "")}
     </div>
    `;
};

import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const buySettingsView = function () {
  return `<div class='buyer-settings-wrapper buy-settings-view'>  
      <hr class="search-price-header header-hr">
      <div class="search-price-header"> 
         <h1 class="secondary">Buy/Bid Settings:</h1>
      </div>
      ${generateTextInput("Buy Price", "", { idAbBuyPrice }, "<br/>")}
      ${generateTextInput(
        "No. of cards to buy",
        1000,
        { idAbCardCount },
        "(Works only with Buy price)"
      )}
      ${generateTextInput("Bid Price", "", { idAbMaxBid }, "<br/>")}
      ${generateTextInput(
        "Bid items expiring in",
        "1H",
        { idAbItemExpiring },
        "(S for seconds, M for Minutes, H for hours)",
        "text",
        "\\d+[H|M|S|h|m|s]$"
      )}
      ${generateTextInput(
        "Search result threshold",
        21,
        { idAbSearchResult },
        "(Buy or bid cards only if the no.of search results <br/> is lesser than the specified value"
      )}
      ${generateToggleInput("Bid Exact Price", { idAbBidExact }, "")}
     </div>
    `;
};

import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult,
  idBuyFutBinPrice,
  idBuyFutBinPercent,
  idAbBidFutBin,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const buySettingsView = function () {
  return `<div class='buyer-settings-wrapper buy-settings-view'>  
      <hr class="search-price-header header-hr">
      <div class="search-price-header"> 
         <h1 class="secondary">Buy/Bid Settings:</h1>
      </div>
      ${generateToggleInput(
        "Find Buy Price",
        { idBuyFutBinPrice },
        "(Uses Futbin price for Buy Price)",
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Buy Price Percent",
        100,
        { idBuyFutBinPercent },
        `(Buy Price percent of FUTBIN Price)`,
        "BuyerSettings"
      )}
      ${generateToggleInput(
        "Bid For FUTBIN Price",
        { idAbBidFutBin },
        "(Bid if the current bid is lesser than FUTBIN Pice)",
        "BuyerSettings"
      )}      
      ${generateToggleInput(
        "Bid Exact Price",
        { idAbBidExact },
        "",
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Buy Price",
        "",
        { idAbBuyPrice },
        "<br/>",
        "BuyerSettings"
      )}
      ${generateTextInput(
        "No. of cards to buy",
        1000,
        { idAbCardCount },
        "(Works only with Buy price)",
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Bid Price",
        "",
        { idAbMaxBid },
        "<br/>",
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Bid items expiring in",
        "1H",
        { idAbItemExpiring },
        "(S for seconds, M for Minutes, H for hours)",
        "BuyerSettings",
        "text",
        "\\d+[H|M|S|h|m|s]$"
      )}
      ${generateTextInput(
        "Search result threshold",
        21,
        { idAbSearchResult },
        "(Buy or bid cards only if the no.of search results <br/> is lesser than the specified value",
        "BuyerSettings"
      )}
     </div>
    `;
};

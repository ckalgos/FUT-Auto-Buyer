import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult, idBuyFutBinPercent, idBuyFutBinPrice, idShouldSort,
  idSortBy,
  idSortOrder
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
      ${generateToggleInput(
        "Bid Exact Price",
        { idAbBidExact },
        "",
        "BuyerSettings"
      )}
<<<<<<< HEAD
      ${generateToggleInput("Bid Exact Price", { idAbBidExact }, "<br />")}
      ${generateToggleInput("Sort players", { idShouldSort }, "<br />")}
      <div style="width:50%;" class="displayCenterFlx">
      <select style="width:95%;height: 3rem;font-size: 1.5rem;" class="select-sortBy" id="${idSortBy}">
        <option value="buy" selected="true">Buy now price</option>
        <option value="bid">Bid now price</option>
        <option value="rating">Player rating</option>
      </select>
=======
>>>>>>> 56c360503d6cfd543767110006fb1ec8fdbaa77e
     </div>
     ${generateToggleInput("Order", { idSortOrder }, "(Enabled = descending, Disabled = ascending)<br />")}
    `;
};

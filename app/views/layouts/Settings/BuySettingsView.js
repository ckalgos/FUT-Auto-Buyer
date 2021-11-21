import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult, idAbShouldSort, idAbSortBy, idAbSortOrder, idBuyFutBinPercent, idBuyFutBinPrice
} from "../../../elementIds.constants";
import { setValue } from "../../../services/repository";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

const updateAbSortBy = () => {
  const sortBy = $(`#${idAbSortBy}`).val() || "buy";
  setValue("sortPlayersBy", sortBy);
}

$(document).on( { change: updateAbSortBy }, `#${idAbSortBy}` );

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
      ${generateToggleInput("Sort players", { idAbShouldSort }, "<br />", "BuyerSettings")}
      <div style="width:50%;" class="displayCenterFlx">
      <select style="width:95%;height: 3rem;font-size: 1.5rem;" class="select-sortBy filter-header-settings" id="${idAbSortBy}">
        <option value="buy" selected>Buy now price</option>
        <option value="bid">Bid now price</option>
        <option value="rating">Player rating</option>
        <option value="reverse">reverse</option>
      </select>
     </div>
     ${generateToggleInput("Order", { idAbSortOrder }, "(Enabled = descending, Disabled = ascending)<br />", "BuyerSettings")}
     </div>
    `;
};

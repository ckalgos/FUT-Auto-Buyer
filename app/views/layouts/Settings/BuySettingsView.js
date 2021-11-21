import {
  idAbBidExact,
  idAbBidFutBin,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult,
  idAbShouldSort,
  idAbSortBy,
  idAbSortOrder,
  idBuyFutBinPercent,
  idBuyFutBinPrice,
} from "../../../elementIds.constants";
import { getValue, setValue } from "../../../services/repository";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

const updateAbSortBy = () => {
  const sortBy = $(`#${idAbSortBy}`).val() || "buy";
  const buyerSetting = getValue("BuyerSettings") || {};
  buyerSetting["idAbSortBy"] = sortBy;
  setValue("BuyerSettings", buyerSetting);
};

$(document).on({ change: updateAbSortBy }, `#${idAbSortBy}`);

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
        "Buy/Bid Price Percent",
        100,
        { idBuyFutBinPercent },
        `(Buy/Bid Price percent of FUTBIN Price)`,
        "BuyerSettings"
      )}
      ${generateToggleInput(
        "Bid For FUTBIN Price",
        { idAbBidFutBin },
        "(Bid if the current bid <br /> is lesser than FUTBIN Price)",
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
        "(Buy or bid cards only if the no.of search results <br/> is lesser than the specified value)",
        "BuyerSettings"
      )}
      ${generateToggleInput(
        "Bid Exact Price",
        { idAbBidExact },
        "",
        "BuyerSettings"
      )}
      ${generateToggleInput(
        "Sort players",
        { idAbShouldSort },
        "",
        "BuyerSettings"
      )}
      <div class="price-filter buyer-settings-field">
        <div class="displayCenterFlx">
        <select style="width:95%;height: 3rem;font-size: 1.5rem;" class="select-sortBy filter-header-settings" id="${idAbSortBy}">
          <option disabled selected>--Select Sort Attribute--</option>
          <option value="buy">Buy now price</option>
          <option value="bid">Bid now price</option>
          <option value="rating">Player rating</option>
        </select>
        </div>
      </div>
     ${generateToggleInput(
       "Order",
       { idAbSortOrder },
       "(Enabled = descending, <br />Disabled = ascending)",
       "BuyerSettings"
     )}
     </div>
    `;
};

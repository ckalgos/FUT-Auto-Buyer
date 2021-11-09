import {
  idAbMinDeleteCount,
  idAbSellPrice,
  idAbSellToggle,
  idSellAfterTax,
  idSellRatingThreshold,
  idSellFutBinPrice,
  idSellFutBinPercent,
  idSellCheckBuyPrice,
  idFutBinDuration,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

$(document).on("keyup", "#" + idAbSellPrice, function ({ target: { value } }) {
  updateAfterTax(value);
});

const updateAfterTax = (salePrice) => {
  const parsedSalePrice = parseInt(salePrice);
  if (isNaN(parsedSalePrice)) {
    $("#" + idSellAfterTax).html(0);
    return;
  }
  const calculatedPrice = (salePrice - (salePrice / 100) * 5).toLocaleString();
  $("#" + idSellAfterTax).html(calculatedPrice);
};

export const sellSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper sell-settings-view'>    
    <hr class="search-price-header header-hr">
    <div class="search-price-header">
      <h1 class="secondary">Sell Settings:</h1>
    </div>
    ${generateToggleInput(
      "Find Sale Price",
      { idSellFutBinPrice },
      "(Uses Futbin price for listing)",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Sell Price Percent",
      100,
      { idSellFutBinPercent },
      `(Sale Price percent of FUTBIN Price)`,
      "BuyerSettings"
    )}
    ${generateToggleInput(
      "Check buy price before listing",
      { idSellCheckBuyPrice },
      "(List only if Buy Price <br /> is lesser than Sale Price)",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Sell Price",
      "",
      { idAbSellPrice },
      `(-1 to send to transferlist)<br />Receive After Tax: <span id=${idSellAfterTax}>0</span>`,
      "BuyerSettings"
    )}
    ${generateTextInput(
      "List Duration",
      "1H",
      { idFutBinDuration },
      "List Duration when listing",
      "BuyerSettings",
      "text",
      "\\d+[H|M|S|h|m|s]$"
    )}
    ${generateTextInput(
      "Clear sold count",
      10,
      { idAbMinDeleteCount },
      "(Clear sold items when reach a specified count)<br />",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Rating Threshold",
      100,
      { idSellRatingThreshold },
      "(Rating threshold to list the sniped player)",
      "BuyerSettings"
    )}
    ${generateToggleInput(
      "Relist Unsold Items",
      { idAbSellToggle },
      "",
      "BuyerSettings"
    )}
    </div>`;
};

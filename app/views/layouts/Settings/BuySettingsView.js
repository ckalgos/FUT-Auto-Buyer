import {
  idAbBidExact,
  idAbBuyPrice,
  idAbCardCount,
  idAbItemExpiring,
  idAbMaxBid,
  idAbSearchResult,
  idBuyFutBinPrice,
  idAbBidFutBin,
  idBuyFutBinPercent,
  idAbExternalPriceMin,
  idAbExternalPriceMax,
} from "../../../elementIds.constants";
import { getDataSource } from "../../../services/repository";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const buySettingsView = function () {
  const dataSource = getDataSource();
  return `<div class='buyer-settings-wrapper buy-settings-view'>
      ${generateToggleInput(
        "Find Buy Price",
        { idBuyFutBinPrice },
        `(Uses ${dataSource} price for Buy)`,
        "BuyerSettings"
      )}
      ${generateTextInput(
        "Buy/Bid Price Percent",
        100,
        { idBuyFutBinPercent },
        `(Buy/Bid Price percent of ${dataSource} Price)`,
        "BuyerSettings"
      )}
      ${generateToggleInput(
        `Bid For ${dataSource} Price`,
        { idAbBidFutBin },
        `(Bid if the current bid is lesser than ${dataSource} Price)`,
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
        "(Buy or bid cards only if the no.of search results is lesser than the specified value)",
        "BuyerSettings"
      )}
      ${generateToggleInput(
        "Bid Exact Price",
        { idAbBidExact },
        "",
        "BuyerSettings"
      )}
      ${generateTextInput(
        "External price min",
        200,
        { idAbExternalPriceMin },
        `(Minimum ${dataSource} Price)`,
        "BuyerSettings"
      )}
      ${generateTextInput(
        "External price max",
        100000,
        { idAbExternalPriceMax },
        `(Maximum ${dataSource} Price)`,
        "BuyerSettings"
      )}      
     </div>
    `;
};

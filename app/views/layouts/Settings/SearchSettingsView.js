import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import {
  idAbAddFilterGK,
  idAbMinRating,
  idAbMaxRating,
  idAbRandMinBidInput,
  idAbRandMinBidToggle,
  idAbRandMinBuyInput,
  idAbRandMinBuyToggle,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";

export const searchSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper results-filter-view'>   
    ${generateTextInput(
      "Min Rating",
      10,
      { idAbMinRating },
      "Minimum Player Rating"
    )}
    ${generateTextInput(
      "Max Rating",
      100,
      { idAbMaxRating },
      "Maximum Player Rating"
    )}
    ${generateTextInput(
      "Max value of random min bid",
      300,
      { idAbRandMinBidInput },
      ""
    )}
    ${generateToggleInput("Use random min bid", { idAbRandMinBidToggle }, "")}
    ${generateTextInput(
      "Max value of random min buy",
      300,
      { idAbRandMinBuyInput },
      ""
    )}
    ${generateToggleInput("Use random min buy", { idAbRandMinBuyToggle }, "")}
    ${generateToggleInput(
      "SKIP GK",
      { idAbAddFilterGK },
      "(Skip all goalkeepers <br/> to buy / bid a card)"
    )}
  </div>`;
};

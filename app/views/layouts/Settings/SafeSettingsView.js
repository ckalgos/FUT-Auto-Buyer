import {
  idAbCycleAmount,
  idAbMaxPurchases,
  idAbPauseFor,
  idAbStopAfter,
  idAbWaitTime,
  idAbAddBuyDelay,
  idAbDelayToAdd,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const safeSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper safety-settings-view'>  
  <hr class="search-price-header header-hr">
  <div class="search-price-header">
    <h1 class="secondary">Safety Settings:</h1>
  </div>
  ${generateTextInput(
    "Wait Time",
    "7-15",
    { idAbWaitTime },
    "(Random second range eg. 7-15)",
    "text"
  )}
  ${generateTextInput(
    "Max purchases per search request",
    1,
    { idAbMaxPurchases },
    "<br/>"
  )}
  ${generateTextInput(
    "Pause Cycle",
    15,
    { idAbCycleAmount },
    "(No. of searches performed before triggering Pause)"
  )}
  ${generateTextInput(
    "Pause For",
    "5-8S",
    { idAbPauseFor },
    "(S for seconds, M for Minutes, H for hours eg. 0-0S)",
    "text"
  )}
  ${generateToggleInput(
    "Add Delay After Buy",
    { idAbAddBuyDelay },
    "(Adds Delay after trying <br/> to buy / bid a card)"
  )}
  ${generateTextInput(
    "Delay To Add",
    "1S",
    { idAbDelayToAdd },
    "(S for seconds, M for Minutes, H for hours)",
    "text"
  )}
  ${generateTextInput(
    "Stop After",
    "1H",
    { idAbStopAfter },
    "(S for seconds, M for Minutes, H for hours)",
    "text"
  )} 
  </div>`;
};

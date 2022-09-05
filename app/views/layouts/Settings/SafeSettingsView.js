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
  ${generateTextInput(
    "Wait Time",
    "7-15",
    { idAbWaitTime },
    "(Random second range eg. 7-15)",
    "CommonSettings",
    "text",
    "\\d+-\\d+$"
  )}
  ${generateTextInput(
    "Max purchases per search request",
    1,
    { idAbMaxPurchases },
    "<br/>",
    "CommonSettings"
  )}
  ${generateTextInput(
    "Pause Cycle",
    "10-15",
    { idAbCycleAmount },
    "(No. of searches performed before triggering Pause eg. 10-15)",
    "CommonSettings",
    "text",
    "\\d+-\\d+$"
  )}
  ${generateTextInput(
    "Pause For",
    "5-8S",
    { idAbPauseFor },
    "(S for seconds, M for Minutes, H for hours eg. 0-0S)",
    "CommonSettings",
    "text",
    "\\d+-\\d+[H|M|S|h|m|s]$"
  )}
  ${generateToggleInput(
    "Add Delay After Buy",
    { idAbAddBuyDelay },
    "(Adds Delay after trying to buy / bid a card)",
    "CommonSettings"
  )}
  ${generateTextInput(
    "Delay To Add",
    "1S",
    { idAbDelayToAdd },
    "(S for seconds, M for Minutes, H for hours)",
    "CommonSettings",
    "text",
    "\\d+[H|M|S|h|m|s]$"
  )}
  ${generateTextInput(
    "Stop After",
    "3-4H",
    { idAbStopAfter },
    "(S for seconds, M for Minutes, H for hours  eg. 3-4H)",
    "CommonSettings",
    "text",
    "\\d+-\\d+[H|M|S|h|m|s]$"
  )} 
  </div>`;
};

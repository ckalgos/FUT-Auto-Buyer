import {
  idAbStopErrorCode,
  idAutoClearLog,
  idAbStopErrorCodeCount,
  idAutoClearExpired,
  idAbResumeAfterErrorOccured,
  idAbUseFutWiz,
  idAbMuteLog,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const commonSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper common-settings-view'>
  ${generateTextInput(
    "Error Codes to stop bot (csv)",
    "",
    { idAbStopErrorCode },
    "(Eg. 412,421,521)",
    "CommonSettings",
    "text",
    "^\\d+(,\\d+)*$"
  )}
  ${generateTextInput(
    "No. of times error code should occur",
    3,
    { idAbStopErrorCodeCount },
    "<br />",
    "CommonSettings"
  )}
  ${generateTextInput(
    "Resume bot after",
    "",
    { idAbResumeAfterErrorOccured },
    "(S for seconds, M for Minutes, H for hours eg. 0-0S)",
    "CommonSettings",
    "text",
    "\\d+-\\d+[H|M|S|h|m|s]$"
  )}
  ${generateToggleInput(
    "Auto Clear Log",
    { idAutoClearLog },
    "(Automatically clear logs every 2 minutes)",
    "CommonSettings"
  )}
  ${generateToggleInput(
    "Auto Clear Expired Items",
    { idAutoClearExpired },
    "(Automatically clear expired items from transfer targets)",
    "CommonSettings"
  )}
  ${generateToggleInput(
    "Use Futwiz Price",
    { idAbUseFutWiz },
    "(Uses Futwiz price for buying/selling cards)",
    "CommonSettings"
  )}
  ${generateToggleInput(
    "Mute log messages",
    { idAbMuteLog },
    "(Do not show log messages for excluded players)",
    "CommonSettings"
  )}
  </div>`;
};

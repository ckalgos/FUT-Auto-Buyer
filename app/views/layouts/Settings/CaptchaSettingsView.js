import {
  idAbCloseTabToggle,
  idAbSolveCaptcha,
  idAntiCaptchKey,
  idProxyAddress,
  idProxyLogin,
  idProxyPassword,
  idProxyPort,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";

export const captchaSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper captcha-settings-view'>
    <div class="search-price-header">
      <h1 class="secondary">Captcha Settings:</h1>
    </div>
    ${generateToggleInput(
      "Close Web App on <br/> Captcha Trigger",
      { idAbCloseTabToggle },
      ""
    )}
    ${generateToggleInput("Auto Solve Captcha", { idAbSolveCaptcha }, "")}
    ${generateTextInput(
      "Anti-Captcha Key",
      "",
      { idAntiCaptchKey },
      "",
      "text"
    )}
    ${generateTextInput("Proxy Address", "", { idProxyAddress }, "", "text")}
    ${generateTextInput("Proxy Port", "", { idProxyPort }, "")}
    ${generateTextInput(
      "Proxy User Name (Optional)",
      "",
      { idProxyLogin },
      "",
      "text"
    )}
    ${generateTextInput(
      "Proxy User Password (Optional)",
      "",
      { idProxyPassword },
      "",
      "text"
    )} 
    `;
};

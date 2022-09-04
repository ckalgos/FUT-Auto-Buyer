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
    <hr class="search-price-header header-hr">
    <div class="search-price-header">
      <h1 class="secondary">Captcha Settings:</h1>
    </div>
    ${generateToggleInput(
      "Close Web App on Captcha Trigger",
      { idAbCloseTabToggle },
      "",
      "CommonSettings"
    )}
    ${generateToggleInput(
      "Auto Solve Captcha",
      { idAbSolveCaptcha },
      "",
      "CommonSettings"
    )}
    ${generateTextInput(
      "Anti-Captcha Key",
      "",
      { idAntiCaptchKey },
      "",
      "CommonSettings",
      "text"
    )}
    ${generateTextInput(
      "Proxy Address",
      "",
      { idProxyAddress },
      "",
      "CommonSettings",
      "text"
    )}
    ${generateTextInput(
      "Proxy Port",
      "",
      { idProxyPort },
      "",
      "CommonSettings"
    )}
    ${generateTextInput(
      "Proxy User Name (Optional)",
      "",
      { idProxyLogin },
      "",
      "CommonSettings",
      "text"
    )}
    ${generateTextInput(
      "Proxy User Password (Optional)",
      "",
      { idProxyPassword },
      "",
      "CommonSettings",
      "text"
    )} 
    `;
};

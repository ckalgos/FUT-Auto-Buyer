import { idProgressAutobuyer } from "../elementIds.constants";
import { playAudio } from "../utils/commonUtil";
import { showCaptchaLogs, writeToLog } from "../utils/logUtil";
import { stopAutoBuyer } from "./autobuyerProcessor";
import { solveCaptcha } from "./captchaSolver";

export const searchErrorHandler = (
  response,
  canSolveCaptcha,
  captchaCloseTab
) => {
  if (
    response.status === UtasErrorCode.CAPTCHA_REQUIRED ||
    (response.error && response.error.code == UtasErrorCode.CAPTCHA_REQUIRED)
  ) {
    if (canSolveCaptcha) {
      writeToLog(
        "[!!!] Captcha got triggered, trying to solve it",
        idProgressAutobuyer
      );
      solveCaptcha();
    } else {
      showCaptchaLogs(captchaCloseTab);
    }
  } else {
    writeToLog(
      `[!!!] Autostopping bot as search failed, please check if you can access transfer market in Web App ${response.status}`,
      idProgressAutobuyer
    );
  }
  playAudio("capatcha");
  stopAutoBuyer();
};

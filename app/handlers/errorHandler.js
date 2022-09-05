import { idProgressAutobuyer } from "../elementIds.constants";
import { increAndGetStoreValue } from "../services/repository";
import { playAudio } from "../utils/commonUtil";
import { showCaptchaLogs, writeToLog } from "../utils/logUtil";
import { stopAutoBuyer } from "./autobuyerProcessor";
import { solveCaptcha } from "./captchaSolver";

export const searchErrorHandler = (
  response,
  canSolveCaptcha,
  captchaCloseTab
) => {
  let shouldStopBot = false;
  if (
    response.status === UtasErrorCode.CAPTCHA_REQUIRED ||
    (response.error && response.error.code == UtasErrorCode.CAPTCHA_REQUIRED)
  ) {
    shouldStopBot = true;
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
    const searchFailedCount = increAndGetStoreValue("searchFailedCount");
    if (searchFailedCount >= 3) {
      shouldStopBot = true;
      writeToLog(
        `[!!!] Autostopping bot as search failed for ${searchFailedCount} consecutive times, please check if you can access transfer market in Web App ${response.status}`,
        idProgressAutobuyer
      );
    } else {
      writeToLog(
        `[!!!] Search failed - ${response.status}`,
        idProgressAutobuyer
      );
    }
  }
  if (shouldStopBot) {
    playAudio("capatcha");
    stopAutoBuyer();
  }
};

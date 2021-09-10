import {
  idAutoBuyerFoundLog,
  idProgressAutobuyer,
} from "../elementIds.constants";
import { getValue } from "../services/repository";
import { initializeLog } from "../views/layouts/LogView";
import { sendNotificationToUser } from "./notificationUtil";

export const writeToDebugLog = (
  ratingTxt,
  playerName,
  bidTxt,
  buyTxt,
  expireTime,
  actionTxt
) => {
  writeToLog(
    "| " +
      ratingTxt +
      " | " +
      playerName +
      " | " +
      bidTxt +
      " | " +
      buyTxt +
      " | " +
      expireTime +
      " | " +
      actionTxt,
    idAutoBuyerFoundLog
  );
};

export const writeToAbLog = (
  sym,
  ItemName,
  priceTxt,
  operation,
  result,
  comments
) => {
  writeToLog(
    sym +
      " | " +
      ItemName +
      " | " +
      priceTxt +
      " | " +
      operation +
      " | " +
      result +
      " | " +
      comments,
    idProgressAutobuyer
  );
};

export const showCaptchaLogs = function (captchaCloseTab) {
  sendNotificationToUser(
    "Captcha, please solve the problem so that the bot can work again."
  );

  if (captchaCloseTab) {
    window.location.href = "about:blank";
    return;
  }
  writeToLog(
    "[!!!] Autostopping bot since Captcha got triggered",
    idProgressAutobuyer
  );
};

export const writeToLog = function (message, log) {
  var $log = jQuery("#" + log);
  message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
  $log.val($log.val() + message);
  if ($log[0]) $log.scrollTop($log[0].scrollHeight);
};

export const clearLogs = () => {
  jQuery("#" + idAutoBuyerFoundLog).val("");
  jQuery("#" + idProgressAutobuyer).val("");
  initializeLog();
};

setInterval(() => {
  const settings = getValue("BuyerSettings");
  let autoClearLog = settings && settings["idAutoClearLog"];
  autoClearLog && clearLogs();
}, 120000);

import { idProgressAutobuyer } from "../elementIds.constants";
import { getBuyerSettings } from "../services/repository";
import { initializeLog } from "../views/layouts/LogView";
import { sendNotificationToUser } from "./notificationUtil";

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
    "Captcha, please solve the problem so that the bot can work again.",
    false
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
  setTimeout(() => {
    var $log = $("#" + log);
    message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
    $log.val($log.val() + message);
    if ($log[0]) $log.scrollTop($log[0].scrollHeight);
  }, 50);
};

export const clearLogs = () => {
  $("#" + idProgressAutobuyer).val("");
  initializeLog();
};

setInterval(() => {
  const settings = getBuyerSettings();
  let autoClearLog = settings && settings["idAutoClearLog"];
  autoClearLog && clearLogs();
}, 120000);

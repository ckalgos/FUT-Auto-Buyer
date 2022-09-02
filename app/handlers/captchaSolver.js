import { idProgressAutobuyer } from "../elementIds.constants";
import { getBuyerSettings, getValue } from "../services/repository";
import { showCaptchaLogs, writeToLog } from "../utils/logUtil";
import { startAutoBuyer } from "./autobuyerProcessor";

export const solveCaptcha = () => {
  const buyerSetting = getBuyerSettings();
  let apikey = buyerSetting["idAntiCaptchKey"];
  let websiteURL = "https://www.ea.com/fifa/ultimate-team/web-app/";
  let websitePublicKey = "A4EECF77-AC87-8C8D-5754-BF882F72063B";

  let proxyAddress = buyerSetting["idProxyAddress"];
  let proxyPort = buyerSetting["idProxyPort"];
  let proxyLogin = buyerSetting["idProxyLogin"];
  let proxyPassword = buyerSetting["idProxyPassword"];

  if (!proxyAddress || !proxyPort || !apikey) {
    writeToLog("Proxy info not filled properly", idProgressAutobuyer);
    showCaptchaLogs(buyerSetting["idAbCloseTabToggle"]);
    return;
  }

  function createTask() {
    accessobjects.Captcha.getCaptchaData().observe(
      this,
      function (sender, responseData) {
        if (responseData.success) {
          var data = responseData.response.blob;
          if (!data) {
            return false;
          }

          let payload = {
            clientKey: apikey,
            task: {
              type: "FunCaptchaTask",
              websiteURL: websiteURL,
              websitePublicKey: websitePublicKey,
              funcaptchaApiJSSubdomain: "ea-api.arkoselabs.com",
              data: responseData.response,
              proxyType: "http",
              proxyAddress: proxyAddress,
              proxyPort: proxyPort,
              proxyLogin: proxyLogin,
              proxyPassword: proxyPassword,
              userAgent:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36",
            },
          };

          var xhr = new XMLHttpRequest();
          xhr.open("POST", "https://api.anti-captcha.com/createTask", true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              var json = JSON.parse(xhr.responseText);
              if (json.errorId == 0) {
                getTaskResult(json.taskId);
              } else {
                writeToLog(
                  "Got error from Captcha API: " +
                    json.errorCode +
                    ", " +
                    json.errorDescription,
                  idProgressAutobuyer
                );
              }
            }
          };
          var data = JSON.stringify(payload);
          xhr.send(data);
          return true;
        }
      }
    );
  }

  function getTaskResult(taskId) {
    let payload = {
      clientKey: apikey,
      taskId: taskId,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.anti-captcha.com/getTaskResult", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        if (json.errorId == 0) {
          //no errors
          if (json.status == "ready") {
            let captchaModel = new UTCaptchaViewModel(accessobjects.Captcha);
            captchaModel
              .validateToken(json.solution.token)
              .observe(this, function (sender, response) {
                if (response.success) {
                  writeToLog("Captcha Solved", idProgressAutobuyer);
                  const instance = getValue("AutoBuyerInstance");
                  startAutoBuyer.call(instance);
                }
              });
          } else {
            setTimeout(() => getTaskResult(taskId), 1000);
          }
        } else {
          writeToLog(
            "Error occured when checking captcha result : " +
              json.errorCode +
              ", " +
              json.errorDescription,
            idProgressAutobuyer
          );
        }
      }
    };
    var data = JSON.stringify(payload);
    xhr.send(data);
  }

  createTask();
};

import { isMarketAlertApp } from "../app.constants";
import { idSession } from "../elementIds.constants";
import { setValue } from "../services/repository";

export const sendExternalRequest = async (options) => {
  if (isMarketAlertApp) {
    sendPhoneRequest(options);
  } else {
    sendWebRequest(options);
  }
};

const sendPhoneRequest = (options) => {
  setValue(options.identifier, options.onload);
  delete options["onload"];
  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type: "fetchFromExternalAB", payload: { options } })
  );
};

const sendWebRequest = (options) => {
  GM_xmlhttpRequest({
    method: options.method,
    url: options.url,
    onload: options.onload,
    headers: { "User-Agent": idSession },
  });
};

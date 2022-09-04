export const sendExternalRequest = async (options) => {
  if (isPhone()) {
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
  });
};

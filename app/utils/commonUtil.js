import * as ElementIds from "../elementIds.constants";

export const generateId = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const wait = async (seconds = 1) => {
  const rndFactor = Math.floor(Math.random());
  await new Promise((resolve) =>
    setTimeout(resolve, (rndFactor + seconds) * 1000)
  );
};

export const showLoader = () => {
  $(".ut-click-shield").addClass("showing");
  $(".loaderIcon ").css("display", "block");
};

export const hideLoader = () => {
  $(".ut-click-shield").removeClass("showing");
  $(".loaderIcon ").css("display", "none");
};

export const downloadJson = (json, fileName) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: "downloadFile",
      payload: { data: JSON.stringify(json, null, 4), fileName },
    })
  );
};

export const downloadCsv = (csvContent, fileName) => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: "downloadFile",
      payload: { data: csvContent, fileName },
    })
  );
};

export const convertRangeToSeconds = (val) => {
  if (val) {
    val = val + "";
    let valInterval = val[val.length - 1].toUpperCase();
    let valInTime = getRandWaitTime(val.substring(0, val.length - 1)) / 1000;
    let multipler = valInterval === "M" ? 60 : valInterval === "H" ? 3600 : 1;
    if (valInTime) {
      valInTime = valInTime * multipler;
    }
    return valInTime;
  }
  return 0;
};

export const getRandNumberInRange = (range) => {
  const rangeVal = getRangeValue(range);
  if (rangeVal.length >= 2) {
    return getRandNum(rangeVal[0], rangeVal[1]);
  }
  return rangeVal[0] || 0;
};

export const getRandWaitTime = (range) => {
  if (range) {
    const [start, end] = range.split("-").map((a) => parseInt(a));
    return Math.round(Math.random() * (end - start) + start) * 1000;
  }
  return 0;
};

export const convertToSeconds = (val) => {
  if (val) {
    let valInterval = val[val.length - 1].toUpperCase();
    let valInTime = parseInt(val.substring(0, val.length - 1));
    let multipler = valInterval === "M" ? 60 : valInterval === "H" ? 3600 : 1;
    if (valInTime) {
      valInTime = valInTime * multipler;
    }
    return valInTime;
  }
  return 0;
};

export const getRandNum = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

export const getRangeValue = (range) => {
  if (range) {
    return (range + "").split("-").map((a) => parseInt(a));
  }
  return [];
};

export const formatString = (str, len) => {
  if (str.length <= len) {
    str += " ".repeat(len - str.length);
  }
  return str;
};

export const promisifyTimeOut = (cb, wait) => {
  return new Promise((resolve) => {
    setTimeout(function () {
      cb();
      resolve();
    }, 1000);
  });
};

export const networkCallWithRetry = (execution, delay, retries) =>
  new Promise((resolve, reject) => {
    return execution()
      .then(resolve)
      .catch((reason) => {
        if (retries > 0) {
          return wait(delay)
            .then(
              networkCallWithRetry.bind(null, execution, delay, retries - 1)
            )
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      });
  });

export const createElementFromHTML = (htmlString) => {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

export const getTimerProgress = function (timer) {
  if (!timer) return 0;
  var time = new Date().getTime();
  return (Math.max(0, timer.end - time) / (timer.end - timer.start)) * 100;
};

export const updateSettingsView = function (settings) {
  for (let key of Object.keys(settings)) {
    const value = settings[key];
    if (settings[key + "isDefaultValue"]) continue;
    const id = `#${ElementIds[key]}`;
    if (typeof value == "boolean") {
      if (value) {
        $(id).addClass("toggled");
        continue;
      }
      $(id).removeClass("toggled");
    } else {
      $(id).val(value);
    }
  }
};

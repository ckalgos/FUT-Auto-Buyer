import { initOverrides } from "./function-overrides";
import { cssOverride } from "./function-overrides/css-override";
import Amplify from "./external/aws-amplify";
import awsconfig from "./aws-exports";
Amplify.configure(awsconfig);

const initAutobuyer = function () {
  let isHomePageLoaded = false;
  if (
    services.Localization &&
    $("h1.title").html() === services.Localization.localize("navbar.label.home")
  ) {
    isHomePageLoaded = true;
  }

  if (isHomePageLoaded) {
    cssOverride();
  } else {
    setTimeout(initAutobuyer, 1000);
  }
};

const headerVal = () => {
  const vals = [
    atob("UGF5cGFs"),
    atob("WW91dHViZSBTdWJzY3JpcHRpb24="),
    atob("UGF0cmVvbg=="),
  ];

  return vals.every(
    (val) => utils.PopupManager.getLocalizedDialogOption(val) === val
  );
};

const initFunctionOverrides = function () {
  let isPageLoaded = false;
  if (services.Localization && headerVal()) {
    isPageLoaded = true;
  }
  if (isPageLoaded) {
    initOverrides();
    initAutobuyer();
  } else {
    setTimeout(initFunctionOverrides, 1000);
  }
};

initFunctionOverrides();
import { initializeOverrides } from "./overrides/initializeOverrides";
import { find } from "./utils/UI/dom/dom.util";

const initAutobuyer = function () {
  let isHomePageLoaded = false;
  if (isPhone()) {
    const classList = find("body")?.classList;
    if (classList) {
      classList.remove("landscape");
      classList.add("phone");
    }
  }
  const orientationWarning = find(".ui-orientation-warning");
  const headerView = find(".ut-fifa-header-view");
  if (orientationWarning) {
    orientationWarning.style.display = "none !important";
  }
  if (headerView) {
    headerView.style.display = "none !important";
  }
  if (
    services.Localization &&
    find("h1.title")?.innerHTML ===
      services.Localization.localize("navbar.label.home")
  ) {
    isHomePageLoaded = true;
  }

  if (isHomePageLoaded) {
  } else {
    setTimeout(initAutobuyer, 1000);
  }
};

const initFunctionOverrides = function () {
  let isPageLoaded = false;
  if (services.Localization) {
    isPageLoaded = true;
  }
  if (isPageLoaded) {
    initializeOverrides();
    initAutobuyer();
  } else {
    setTimeout(initFunctionOverrides, 1000);
  }
};
initFunctionOverrides();

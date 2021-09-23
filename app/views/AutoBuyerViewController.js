import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { statsProcessor } from "../handlers/statsProcessor";
import { clearLogs } from "../utils/logUtil";
import { createButton } from "./layouts/ButtonView";
import { BuyerStatus } from "./layouts/HeaderView";
import { initializeLog, logView } from "./layouts/LogView";
import { clearSettingMenus, generateMenuItems } from "./layouts/MenuItemView";
import { filterHeaderSettingsView } from "./layouts/Settings/FilterSettingsView";

export const AutoBuyerViewController = function (t) {
  UTMarketSearchFiltersViewController.call(this);
};

const searchFiltersViewInit =
  UTMarketSearchFiltersViewController.prototype.init;

const searchFiltersAppear =
  UTMarketSearchFiltersViewController.prototype.viewDidAppear;

JSUtils.inherits(AutoBuyerViewController, UTMarketSearchFiltersViewController);

AutoBuyerViewController.prototype.init = function () {
  searchFiltersViewInit.call(this);
  let view = this.getView();
  if (!isPhone()) view.__root.style = "width: 52%; float: left;";

  const menuItems = generateMenuItems.call(this);
  let root = $(view.__root);
  //   root.find(".ut-pinned-list-container").append($(menuItems.__root));
  const createButtonWithContext = createButton.bind(this);
  const stopBtn = createButtonWithContext("Stop", () =>
    stopAutoBuyer.call(this)
  );
  const clearLogBtn = createButtonWithContext("Clear Log", () =>
    clearLogs.call(this)
  );
  const searchBtn = createButtonWithContext(
    "Start",
    () => startAutoBuyer.call(this),
    "call-to-action"
  );

  statsProcessor();

  const btnContainer = root.find(".button-container");
  btnContainer.addClass("buyer-actions");
  btnContainer.find(".call-to-action").remove();
  const btnReset = btnContainer.find('button:contains("Reset")');
  btnReset.on("click", function () {
    clearSettingMenus();
  });

  btnContainer.append($(searchBtn.__root));
  btnContainer.append($(stopBtn.__root));
  btnContainer.append($(clearLogBtn.__root));
  root.find(".search-prices").append(menuItems.__root);
  filterHeaderSettingsView.call(this).then((res) => {
    root.find(".ut-item-search-view").first().prepend(res);
  });
};

AutoBuyerViewController.prototype.viewDidAppear = function () {
  this.getNavigationController().setNavigationVisibility(true, true);
  searchFiltersAppear.call(this);
};

AutoBuyerViewController.prototype.getNavigationTitle = function () {
  setTimeout(() => {
    const title = $(".title");
    isPhone() && title.addClass("buyer-header");
    title.append(BuyerStatus());
    $(".ut-navigation-container-view--content").append(logView());
    initializeLog();
  });
  return `AutoBuyer `;
};

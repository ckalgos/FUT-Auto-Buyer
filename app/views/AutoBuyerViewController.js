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

UTMarketSearchFiltersView.prototype._generate;

JSUtils.inherits(AutoBuyerViewController, UTMarketSearchFiltersViewController);

AutoBuyerViewController.prototype.init = function () {
  searchFiltersViewInit.call(this);
  let view = this.getView();
  if (!isPhone()) view.__root.style = "width: 55%; float: left;";

  const menuItems = generateMenuItems.call(this);
  let root = jQuery(view.__root);
  //   root.find(".ut-pinned-list-container").append(jQuery(menuItems.__root));
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

  btnContainer.append(jQuery(searchBtn.__root));
  btnContainer.append(jQuery(stopBtn.__root));
  btnContainer.append(jQuery(clearLogBtn.__root));
  root.find(".search-prices").append(menuItems.__root);
  root
    .find(".ut-item-search-view")
    .first()
    .prepend(filterHeaderSettingsView.call(this));
};

AutoBuyerViewController.prototype.viewDidAppear = function () {
  this.getNavigationController().setNavigationVisibility(true, true);
  searchFiltersAppear.call(this);
};

AutoBuyerViewController.prototype.getNavigationTitle = function () {
  setTimeout(() => {
    const title = jQuery(".title");
    isPhone() && title.addClass("buyer-header");
    title.append(BuyerStatus());
    jQuery(".ut-navigation-container-view--content").append(logView());
    initializeLog();
  });
  return `AutoBuyer `;
};

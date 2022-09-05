import { idFilterDropdown } from "../elementIds.constants";
import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { statsProcessor } from "../handlers/statsProcessor";
import { getValue, setValue } from "../services/repository";
import { updateSettingsView } from "../utils/commonUtil";
import { clearLogs } from "../utils/logUtil";
import { createButton } from "./layouts/ButtonView";
import { BuyerStatus, HeaderView } from "./layouts/HeaderView";
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
  setValue("AutoBuyerInstance", this);

  const menuItems = generateMenuItems.call(this);
  let root = $(view.__root);
  const createButtonWithContext = createButton.bind(this);
  const stopBtn = createButtonWithContext("Stop", () =>
    stopAutoBuyer.call(this)
  );
  const clearLogBtn = createButtonWithContext(
    "Clear Log",
    () => clearLogs.call(this),
    "btn-other"
  );
  const searchBtn = createButtonWithContext(
    "Start",
    () => {
      startAutoBuyer.call(this);
      $(`.ut-navigation-container-view--content`).animate(
        {
          scrollTop: $(`.ut-navigation-container-view--content`).prop(
            "scrollHeight"
          ),
        },
        400
      );
    },
    "call-to-action"
  );

  statsProcessor();

  root.addClass("auto-buyer");
  const btnContainer = root.find(".button-container");
  btnContainer.addClass("buyer-actions");
  btnContainer.find(".call-to-action").remove();
  const btnReset = btnContainer.find('button:contains("Reset")');
  btnReset.on("click touchend", async function () {
    $(`#${idFilterDropdown}`).prop("selectedIndex", 0);
    await clearSettingMenus();
  });
  btnReset.addClass("btn-other");
  btnContainer.append($(searchBtn.__root));
  btnContainer.append($(stopBtn.__root));
  btnContainer.append($(clearLogBtn.__root));
  $(menuItems.__root).find(".menu-container").addClass("settings-menu");
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
    $(".view-navbar-currency").remove();
    $(".view-navbar-clubinfo").remove();
    title.append(BuyerStatus());
    $(HeaderView()).insertAfter(title);
    $(".ut-navigation-container-view--content").append(logView());
    initializeLog();
    updateSettingsView(getValue("CommonSettings") || {});
  });
  return `AutoBuyer `;
};

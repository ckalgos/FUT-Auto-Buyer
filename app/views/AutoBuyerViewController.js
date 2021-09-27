import { idAbCompactView } from "../elementIds.constants";
import { startAutoBuyer, stopAutoBuyer } from "../handlers/autobuyerProcessor";
import { statsProcessor } from "../handlers/statsProcessor";
import { getValue, setValue } from "../services/repository";
import { createElementFromHTML } from "../utils/commonUtil";
import { clearLogs } from "../utils/logUtil";
import { generateToggleInput } from "../utils/uiUtils/generateToggleInput";
import { createButton } from "./layouts/ButtonView";
import { BuyerStatus } from "./layouts/HeaderView";
import { initializeLog, logView } from "./layouts/LogView";
import {
  clearSettingMenus,
  generateMenuItems,
  setDefaultActiveTab,
} from "./layouts/MenuItemView";
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

  root.addClass("auto-buyer");
  const btnContainer = root.find(".button-container");
  btnContainer.addClass("buyer-actions");
  btnContainer.find(".call-to-action").remove();
  const btnReset = btnContainer.find('button:contains("Reset")');
  btnReset.on("click", async function () {
    await clearSettingMenus();
  });

  btnContainer.append($(searchBtn.__root));
  btnContainer.append($(stopBtn.__root));
  btnContainer.append($(clearLogBtn.__root));
  root.find(".search-prices").append(
    createElementFromHTML(
      generateToggleInput(
        "Legacy View",
        { idAbCompactView },
        "",
        "mrgTop10",
        (evt) => {
          let legacyView = getValue("LegacyView");
          if (legacyView) {
            legacyView = false;
            $(evt.currentTarget).removeClass("toggled");
          } else {
            legacyView = true;
            $(evt.currentTarget).addClass("toggled");
          }
          setValue("LegacyView", legacyView);
          if (legacyView) {
            $(".menu-container").css("display", "none");
            $(".buyer-settings-wrapper").css("display", "");
            $(".search-price-header").attr("style", "display: flex !important");
          } else {
            $(".buyer-settings-wrapper").css("display", "none");
            $(".search-price-header").removeAttr("style");
            $(".menu-container").css("display", "block");
            $(".buy-settings-view").css("display", "");
            setDefaultActiveTab();
          }
        }
      )
    )
  );
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

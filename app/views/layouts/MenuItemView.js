import { buySettingsView } from "./Settings/BuySettingsView";
import { sellSettingsView } from "./Settings/SellSettingsView";
import { safeSettingsView } from "./Settings/SafeSettingsView";
import { captchaSettingsView } from "./Settings/CaptchaSettingsView";
import { notificationSettingsView } from "./Settings/NotificationSettingsView";
import { commonSettingsView } from "./Settings/CommonSettingsView";
import {
  destoryPlayerInput,
  searchSettingsView,
} from "./Settings/SearchSettingsView";
import { filterSettingsView } from "./Settings/FilterSettingsView";
import { getValue, setValue } from "../../services/repository";
import { updateMultiFilterSettings } from "../../utils/filterUtil";
import { getUserFilters } from "../../utils/dbUtil";
import { idAbSortBy } from "../../elementIds.constants";
import { initializeDiscordClient } from "../../utils/notificationUtil";

const settingsLookup = new Map();
settingsLookup.set(0, {
  label: "Buy/Bid Settings",
  selector: ".buy-settings-view",
});
settingsLookup.set(1, {
  label: "Sell Settings",
  selector: ".sell-settings-view",
});
settingsLookup.set(2, {
  label: "Search Settings",
  selector: ".results-filter-view",
});
settingsLookup.set(3, {
  label: "Safety Settings",
  selector: ".safety-settings-view",
});
settingsLookup.set(4, {
  label: "Filter Settings",
  selector: ".filter-settings-view",
});
settingsLookup.set(5, {
  label: "Captcha Settings",
  selector: ".captcha-settings-view",
});
settingsLookup.set(6, {
  label: "Notification Settings",
  selector: ".notification-settings-view",
});
settingsLookup.set(7, {
  label: "Common Settings",
  selector: ".common-settings-view",
});

let menuRoot;
let menuItems;

export const generateMenuItems = function () {
  menuItems = new EAFilterBarView();
  settingsLookup.forEach((value, key) => {
    menuItems.addTab(key, value.label);
  });
  menuItems.setActiveTab(0);
  menuItems.layoutSubviews();

  menuItems.addTarget(this, onSettingChange, EventType.TAP);
  menuItems.__root.style = "margin-top: 20px;";

  menuRoot = $(menuItems.__root);
  menuRoot.find(".menu-container").css("overflow-x", "auto");

  appendMenuItems(true);
  return menuItems;
};

export const clearSettingMenus = async () => {
  deleteAllMenu();
  await appendMenuItems();
  const autoBuyerInstance = getValue("AutoBuyerInstance");
  UTMarketSearchFiltersViewController.prototype._eResetSelected.call(
    autoBuyerInstance
  );
};

export const setDefaultActiveTab = () => {
  menuItems.setActiveTab(0);
  $(".menu-container").animate({
    scrollLeft: 0,
  });
};

export const updateCommonSettings = async (isInit) => {
  let commonSettings = await getUserFilters("CommonSettings");
  commonSettings = JSON.parse(commonSettings["CommonSettings"] || "{}");
  if (!$.isEmptyObject(commonSettings)) {
    const currentValue = isInit ? getValue("CommonSettings") : {};
    setValue("CommonSettings", { ...(currentValue || {}), ...commonSettings });
  }
  if (isInit) {
    initializeDiscordClient();
  }
};

const appendMenuItems = async (isInit) => {
  menuItems.setActiveTab(0);
  menuRoot.append(buySettingsView.call(this));
  menuRoot.append(sellSettingsView.call(this));
  menuRoot.append(searchSettingsView.call(this));
  menuRoot.append(safeSettingsView.call(this));
  const filterVal = await filterSettingsView.call(this);
  menuRoot.append(filterVal);
  menuRoot.append(captchaSettingsView.call(this));
  menuRoot.append(notificationSettingsView.call(this));
  menuRoot.append(commonSettingsView.call(this));

  $(".menu-container").animate({
    scrollLeft: 0,
  });

  const legacyView = getValue("LegacyView");
  if (legacyView) {
    $(".menu-container").css("display", "none");
    $(".buyer-settings-wrapper").css("display", "");
    $(".buyer-settings-wrapper .search-price-header").attr(
      "style",
      "display: flex !important"
    );
  }

  setTimeout(async () => {
    const selectedFilters = getValue("selectedFilters") || [];
    const { idAbSortBy: sortBy } = getValue("BuyerSettings") || {};
    if (sortBy) {
      $(`${idAbSortBy} option[value='${sortBy}']`).prop("selected", "selected");
    }
    $.each(selectedFilters, function (idx, val) {
      $(".multiselect-filter option[value='" + val + "']").prop(
        "selected",
        "selected"
      );
    });
    if (isInit) {
      await updateCommonSettings(isInit);
    }
    if (selectedFilters.length) {
      updateMultiFilterSettings();
    }
  });
};

const deleteAllMenu = () => {
  settingsLookup.forEach((value, key) => {
    $(value.selector).remove();
  });
  destoryPlayerInput();
};

const onSettingChange = function (e, t, i) {
  hideAllSection();
  const selectedTab = settingsLookup.get(i.index).selector;
  $(selectedTab).css("display", "");
};

const hideAllSection = () => {
  settingsLookup.forEach((value, key) => {
    $(value.selector).css("display", "none");
  });
};

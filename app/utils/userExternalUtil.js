import * as ElementIds from "../elementIds.constants";
import { getValue, setValue } from "../services/repository";
import { clearSettingMenus } from "../views/layouts/MenuItemView";
import { checkAndAppendOption } from "./filterUtil";
import { sendUINotification } from "./notificationUtil";

const filterDropdownId = `#${ElementIds.idFilterDropdown}`;

export const saveFilterDetails = function (self) {
  const btnContext = this;
  jQuery(btnContext).addClass("active");
  let buyerSetting = getValue("BuyerSettings");
  setTimeout(function () {
    let settingsJson = {};
    const viewModel = self._viewmodel;
    settingsJson.searchCriteria = {
      criteria: viewModel.searchCriteria,
      playerData: viewModel.playerData,
      buyerSettings: buyerSetting,
    };

    let currentFilterName = jQuery(`${filterDropdownId} option`)
      .filter(":selected")
      .val();

    if (currentFilterName === "Choose filter to load") {
      currentFilterName = undefined;
    }
    let filterName = prompt("Enter a name for this filter", currentFilterName);

    if (filterName) {
      filterName = filterName.toUpperCase();
      checkAndAppendOption(filterDropdownId, filterName);
      checkAndAppendOption(`#${ElementIds.idSelectedFilter}`, filterName);

      $(`${filterDropdownId} option[value="${filterName}"]`).attr(
        "selected",
        true
      );

      GM_setValue(filterName, JSON.stringify(settingsJson));
      jQuery(btnContext).removeClass("active");
      sendUINotification("Changes saved successfully");
    } else {
      jQuery(btnContext).removeClass("active");
      sendUINotification(
        "Filter Name Required",
        enums.UINotificationType.NEGATIVE
      );
    }
  }, 200);
};

export const loadFilter = function (currentFilterName) {
  clearSettingMenus();
  const filterSetting = GM_getValue(currentFilterName);
  if (!filterSetting) return;
  const {
    searchCriteria: { criteria, playerData, buyerSettings },
  } = JSON.parse(filterSetting);
  setValue("BuyerSettings", buyerSettings);
  this._viewmodel.playerData = {};
  Object.assign(this._viewmodel.searchCriteria, criteria);
  Object.assign(this._viewmodel.playerData, playerData);

  if (jQuery.isEmptyObject(this._viewmodel.playerData)) {
    this._viewmodel.playerData = null;
  }

  this.viewDidAppear();

  for (let key of Object.keys(buyerSettings)) {
    const value = buyerSettings[key];
    if (buyerSettings[key + "isDefaultValue"]) continue;
    const id = `#${ElementIds[key]}`;
    if (typeof value == "boolean") {
      if (value) {
        jQuery(id).addClass("toggled");
        continue;
      }
      jQuery(id).removeClass("toggled");
    } else {
      jQuery(id).val(value);
    }
  }
};

export const deleteFilter = function () {
  const filterName = $(`${filterDropdownId} option`).filter(":selected").val();
  if (filterName != "Choose filter to load") {
    $(`${filterDropdownId}` + ` option[value="${filterName}"]`).remove();
    jQuery(`${filterDropdownId}`).prop("selectedIndex", 0);

    clearSettingMenus();
    this._viewmodel.playerData = null;

    Object.assign(
      this._viewmodel.searchCriteria,
      this._viewmodel.defaultSearchCriteria
    );
    this.viewDidAppear();

    GM_deleteValue(filterName);
    sendUINotification("Changes saved successfully");
  }
};

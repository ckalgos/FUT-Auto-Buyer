import * as ElementIds from "../elementIds.constants";
import { getValue, setValue } from "../services/repository";
import { clearSettingMenus } from "../views/layouts/MenuItemView";
import { deleteFilters, insertFilters } from "./dbUtil";
import { checkAndAppendOption, updateMultiFilterSettings } from "./filterUtil";
import { sendUINotification } from "./notificationUtil";

const filterDropdownId = `#${ElementIds.idFilterDropdown}`;
const selectedFilterId = `#${ElementIds.idSelectedFilter}`;

export const saveFilterDetails = function (self) {
  const btnContext = this;
  $(btnContext).addClass("active");
  let buyerSetting = getValue("BuyerSettings");
  setTimeout(function () {
    let settingsJson = {};
    const viewModel = self._viewmodel;
    settingsJson.searchCriteria = {
      criteria: viewModel.searchCriteria,
      playerData: viewModel.playerData,
      buyerSettings: buyerSetting,
    };

    let currentFilterName = $(`${filterDropdownId} option`)
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

      getValue("filters")[filterName] = JSON.stringify(settingsJson);
      insertFilters(filterName, getValue("filters")[filterName]);
      $(btnContext).removeClass("active");
      sendUINotification("Changes saved successfully");
    } else {
      $(btnContext).removeClass("active");
      sendUINotification("Filter Name Required", UINotificationType.NEGATIVE);
    }
  }, 200);
};

export const loadFilter = async function (currentFilterName) {
  await clearSettingMenus();
  const filterSetting = getValue("filters")[currentFilterName];
  if (!filterSetting) return;
  const {
    searchCriteria: { criteria, playerData, buyerSettings },
  } = JSON.parse(filterSetting);
  setValue("BuyerSettings", buyerSettings);
  setValue("currentFilter", currentFilterName);
  this._viewmodel.playerData = {};
  Object.assign(this._viewmodel.searchCriteria, criteria);
  Object.assign(this._viewmodel.playerData, playerData);

  if ($.isEmptyObject(this._viewmodel.playerData)) {
    this._viewmodel.playerData = null;
  }

  this.viewDidAppear();

  for (let key of Object.keys(buyerSettings)) {
    const value = buyerSettings[key];
    if (buyerSettings[key + "isDefaultValue"]) continue;
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

export const deleteFilter = async function () {
  const filterName = $(`${filterDropdownId} option`).filter(":selected").val();
  if (filterName != "Choose filter to load") {
    $(`${filterDropdownId}` + ` option[value="${filterName}"]`).remove();
    $(`${filterDropdownId}`).prop("selectedIndex", 0);

    await clearSettingMenus();
    this._viewmodel.playerData = null;

    Object.assign(
      this._viewmodel.searchCriteria,
      this._viewmodel.defaultSearchCriteria
    );
    this.viewDidAppear();

    delete getValue("filters")[filterName];
    $(`${selectedFilterId}` + ` option[value="${filterName}"]`).remove();
    updateMultiFilterSettings();
    deleteFilters(filterName);
    sendUINotification("Changes saved successfully");
  }
};

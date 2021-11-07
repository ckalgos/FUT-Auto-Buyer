import * as ElementIds from "../elementIds.constants";
import { getBuyerSettings, getValue, setValue } from "../services/repository";
import {
  clearSettingMenus,
  updateCommonSettings,
} from "../views/layouts/MenuItemView";
import { updateSettingsView } from "./commonUtil";
import { deleteFilters, insertFilters } from "./dbUtil";
import { checkAndAppendOption, updateMultiFilterSettings } from "./filterUtil";
import { sendUINotification } from "./notificationUtil";

const filterDropdownId = `#${ElementIds.idFilterDropdown}`;
const selectedFilterId = `#${ElementIds.idSelectedFilter}`;

const validateSettings = () => {
  if (document.querySelectorAll(":invalid").length) {
    sendUINotification(
      "Settings with invalid value found, fix these values for autobuyer to work as intended",
      UINotificationType.NEGATIVE
    );
  }
};

export const saveFilterDetails = function (self) {
  const btnContext = this;
  $(btnContext).addClass("active");
  let buyerSetting = getBuyerSettings(true);
  let commonSettings = getValue("CommonSettings");
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

    validateSettings();

    if (currentFilterName === "Choose filter to load") {
      currentFilterName = undefined;
    }
    let filterName = prompt("Enter a name for this filter", currentFilterName);

    if (filterName) {
      saveFilterInDB(filterName, settingsJson);
      insertFilters(
        "CommonSettings",
        JSON.stringify(commonSettings),
        "CommonSettings"
      );
      setValue("currentFilter", filterName);
      $(btnContext).removeClass("active");
      sendUINotification("Changes saved successfully");
    } else {
      $(btnContext).removeClass("active");
      sendUINotification("Filter Name Required", UINotificationType.NEGATIVE);
    }
  }, 200);
};

export const saveFilterInDB = (filterName, settingsJson) => {
  filterName = filterName.toUpperCase();
  checkAndAppendOption(filterDropdownId, filterName);
  checkAndAppendOption(`#${ElementIds.idSelectedFilter}`, filterName);

  $(`${filterDropdownId} option[value="${filterName}"]`).attr("selected", true);

  getValue("filters")[filterName] = JSON.stringify(settingsJson);
  insertFilters(filterName, getValue("filters")[filterName]);
};

export const loadFilter = async function (currentFilterName) {
  await clearSettingMenus();
  const filterSetting = getValue("filters")[currentFilterName];
  if (!filterSetting) return;
  let {
    searchCriteria: { criteria, playerData, buyerSettings },
  } = JSON.parse(filterSetting);
  await updateCommonSettings();
  const commonSettings = getValue("CommonSettings") || {};
  setValue("BuyerSettings", buyerSettings);
  setValue("currentFilter", currentFilterName);
  buyerSettings = { ...buyerSettings, ...commonSettings };
  this._viewmodel.playerData = {};
  Object.assign(this._viewmodel.searchCriteria, criteria);
  Object.assign(this._viewmodel.playerData, playerData);

  if ($.isEmptyObject(this._viewmodel.playerData)) {
    this._viewmodel.playerData = null;
  }

  this.viewDidAppear();

  updateSettingsView(buyerSettings);

  if (
    buyerSettings["idAddIgnorePlayersList"] &&
    buyerSettings["idAddIgnorePlayersList"].length
  ) {
    for (let { displayName } of buyerSettings["idAddIgnorePlayersList"]) {
      checkAndAppendOption(
        `#${ElementIds.idAddIgnorePlayersList}`,
        displayName
      );
    }
  }

  validateSettings();
};

export const deleteFilter = async function () {
  const filterName = $(`${filterDropdownId} option`).filter(":selected").val();
  if (filterName != "Choose filter to load") {
    $(`${filterDropdownId}` + ` option[value="${filterName}"]`).remove();
    $(`${filterDropdownId}`).prop("selectedIndex", 0);

    await clearSettingMenus();
    this.viewDidAppear();

    delete getValue("filters")[filterName];
    $(`${selectedFilterId}` + ` option[value="${filterName}"]`).remove();
    updateMultiFilterSettings();
    deleteFilters(filterName);
    setValue("currentFilter", null);
    sendUINotification("Changes saved successfully");
  }
};

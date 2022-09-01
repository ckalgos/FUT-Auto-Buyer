import { idSelectedFilter, idSelectFilterCount } from "../elementIds.constants";
import { setValue } from "../services/repository";

export const checkAndAppendOption = function (dropdownSelector, optionName) {
  let exist = false;
  $(`${dropdownSelector} option`).each(function () {
    if (this.value === optionName) {
      exist = true;
      return false;
    }
  });

  if (!exist) {
    $(dropdownSelector).append(
      $("<option></option>").attr("value", optionName).text(optionName)
    );
  }
  return exist;
};

export const updateMultiFilterSettings = function (e) {
  const selectedFilters = $(`#${idSelectedFilter}`).val() || [];
  if (selectedFilters.length) {
    setValue("selectedFilters", selectedFilters);
    $(`#${idSelectFilterCount}`).text(
      "(" + selectedFilters.length + ") Filter Selected"
    );
  } else {
    setValue("selectedFilters", []);
    $(`#${idSelectFilterCount}`).text("No Filter Selected");
  }
};

import {
  idFilterDropdown,
  idSelectedFilter,
  idSelectFilterCount,
} from "../../../elementIds.constants";
import { updateMultiFilterSettings } from "../../../utils/filterUtil";
import {
  deleteFilter,
  loadFilter,
  saveFilterDetails,
} from "../../../utils/userExternalUtil";
import { createButton } from "../ButtonView";

jQuery(document).on(
  {
    click: updateMultiFilterSettings,
    touchend: updateMultiFilterSettings,
  },
  `#${idSelectedFilter}`
);

export const filterSettingsView = function () {
  return `<div style='display : none' class='buyer-settings-wrapper filter-settings-view'> 
                <div class="price-filter buyer-settings-field multiple-filter">
                    <select  multiple="multiple" class="multiselect-filter filter-header-settings" id="${idSelectedFilter}"
                     name="selectedFilters" style="overflow-y : scroll;width: 50%;">
                     ${GM_listValues().map(
                       (value) => `<option value='${value}'>${value}</option>`
                     )}
                    </select>
                    <label style="white-space: nowrap;width: 50%;" id="${idSelectFilterCount}" >No Filter Selected</label>
                </div>
            </div>
    `;
};

export const filterHeaderSettingsView = function () {
  const context = this;
  jQuery(document).on(
    {
      change: function () {
        const filterName = $(`#${idFilterDropdown} option`)
          .filter(":selected")
          .val();
        loadFilter.call(context, filterName);
      },
    },
    `#${idFilterDropdown}`
  );

  const rootHeader = jQuery(`<div style="width:100%;display: flex;">
               <div class="button-container">
                   <select class="filter-header-settings" id=${idFilterDropdown}>
                      <option selected="true" disabled>Choose filter to load</option>
                      ${GM_listValues().map(
                        (value) => `<option value='${value}'>${value}</option>`
                      )}
                   </select>
               </div>
               <div id="btn-actions" style="width:50%;margin-top: 1%;" class="button-container"> 
               </div>
             </div>`);
  const buttons = rootHeader.find("#btn-actions");
  buttons.append(
    createButton(
      "Delete Filter",
      () => deleteFilter.call(context),
      "call-to-action btn-delete-filter"
    ).__root
  );
  buttons.append(
    createButton(
      "Save Filter",
      function () {
        saveFilterDetails.call(this, context);
      },
      "call-to-action btn-save-filter"
    ).__root
  );

  return rootHeader;
};

import {
  idFilterDropdown,
  idSelectedFilter,
  idSelectFilterCount,
  idAbNumberFilterSearch,
  idAbServerLogin,
  idAbDownloadFilter,
  idAbUploadFilter,
} from "../../../elementIds.constants";
import { getValue, setValue } from "../../../services/repository";
import {
  getUserAccessToken,
  handleSignInSignOut,
} from "../../../utils/authUtil";
import { getUserFilters } from "../../../utils/dbUtil";
import {
  uploadFiltersLocal,
  uploadFiltersToServer,
} from "../../../utils/filterSyncUtil";
import { updateMultiFilterSettings } from "../../../utils/filterUtil";
import { generateButton } from "../../../utils/uiUtils/generateButton";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import {
  deleteFilter,
  loadFilter,
  saveFilterDetails,
} from "../../../utils/userExternalUtil";
import { createButton } from "../ButtonView";

$(document).on(
  {
    click: updateMultiFilterSettings,
    touchend: updateMultiFilterSettings,
  },
  `#${idSelectedFilter}`
);

const filters = async () => {
  if (!getValue("filters")) {
    setValue("filters", (await getUserFilters()) || {});
  }

  let filters = getValue("filters");

  filters = Object.keys(filters)
    .sort()
    .reduce((obj, key) => {
      obj[key] = filters[key];
      return obj;
    }, {});

  return filters;
};

export const filterSettingsView = async function () {
  return `<div style='display : none' class='buyer-settings-wrapper filter-settings-view'>  
                <hr class="search-price-header header-hr">
                <div class="search-price-header">
                  <h1 class="secondary">Filter Settings:</h1>
                </div>
                <div class="price-filter buyer-settings-field multiple-filter">
                    <select  multiple="multiple" class="multiselect-filter filter-header-settings" id="${idSelectedFilter}"
                     name="selectedFilters" style="overflow-y : scroll;width: 50%;">
                     ${Object.keys(await filters()).map(
                       (value) => `<option value='${value}'>${value}</option>`
                     )}
                    </select>
                    <label style="white-space: nowrap;width: 50%;" id="${idSelectFilterCount}" >No Filter Selected</label>
                </div>
                ${generateTextInput(
                  "No. of search For each filter",
                  getValue("fiterSearchCount") || 3,
                  { idAbNumberFilterSearch },
                  "(Count of searches performed before switching to another filter)",
                  "number",
                  null,
                  null,
                  (value) => setValue("fiterSearchCount", parseInt(value) || 3)
                )}
            </div>
    `;
};

export const filterHeaderSettingsView = async function () {
  const context = this;
  $(document).on(
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

  const isLoggedIn = await getUserAccessToken(true);

  const rootHeader =
    $(`<div style="width:100%;display: flex;flex-wrap: inherit;">
              <div class="buyer-settings" style="display:flex;justify-content:center">
                ${generateButton(
                  idAbServerLogin,
                  isLoggedIn ? "Logout" : "Login to AB Server",
                  () => {
                    handleSignInSignOut();
                  },
                  "call-to-action"
                )}
              </div>
               <div style="width:100%;" class="button-container">                   
                   <select class="filter-header-settings" id=${idFilterDropdown}>
                      <option selected="true" disabled>Choose filter to load</option>
                      ${Object.keys(await filters()).map(
                        (value) => `<option value='${value}'>${value}</option>`
                      )}
                   </select>
                   
                   ${generateButton(
                     idAbDownloadFilter,
                     "⇧",
                     () => {
                       uploadFiltersLocal();
                     },
                     "filterSync",
                     "Upload filters"
                   )} 
                   ${generateButton(
                     idAbUploadFilter,
                     "⇩",
                     () => {
                       uploadFiltersToServer();
                     },
                     "filterSync",
                     "Download filters"
                   )} 
               </div>
               <div id="btn-actions" style="width:100%;margin-top: 1%;" class="button-container"> 
               </div>
             </div>`);
  const buttons = rootHeader.find("#btn-actions");
  buttons.append(
    createButton(
      "Delete Filter",
      () => {
        deleteFilter.call(context);
      },
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

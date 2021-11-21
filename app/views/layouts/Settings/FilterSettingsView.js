import {
  idFilterDropdown,
  idSelectedFilter,
  idSelectFilterCount,
  idAbNumberFilterSearch,
  idAbServerLogin,
  idAbDownloadFilter,
  idAbUploadFilter,
  idRunFilterSequential,
  idAbReportProblem,
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
import { showPopUp } from "../../../utils/popupUtil";
import { generateButton } from "../../../utils/uiUtils/generateButton";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
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

const getUserFilterAsync = async () => {
  let filters = await getUserFilters();
  return filters;
};

const filters = async () => {
  if (!getValue("filters")) {
    setValue("filters", (await getUserFilterAsync()) || {});
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

const handleSequenceToggle = (evt) => {
  let runSequentially = getValue("runSequentially");
  if (runSequentially) {
    runSequentially = false;
    $(evt.currentTarget).removeClass("toggled");
  } else {
    runSequentially = true;
    $(evt.currentTarget).addClass("toggled");
  }
  setValue("runSequentially", runSequentially);
  return runSequentially;
};

export const filterSettingsView = async function () {
  if (getValue("runSequentially")) {
    setValue("runSequentially", false);
    setTimeout(() => {
      $(`#${idRunFilterSequential}`).click();
    });
  }
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
                  "(Count of searches performed before <br/> switching to another filter)",
                  "CommonSettings",
                  "number",
                  null,
                  "buyer-settings-field",
                  (value) => setValue("fiterSearchCount", parseInt(value) || 3)
                )}
                ${generateToggleInput(
                  "Switch filter sequentially",
                  { idRunFilterSequential },
                  "",
                  "CommonSettings",
                  "buyer-settings-field",
                  handleSequenceToggle
                )}
            </div>
    `;
};

const handleReportProblem = () => {
  showPopUp(
    [
      { labelEnum: atob("RGlzY29yZCAoQ29tbXVuaXR5KQ==") },
      { labelEnum: atob("VHdpdHRlciAoRmFzdCBSZXNwb25zZSk=") },
      { labelEnum: atob("R2l0aHVi") },
    ],
    atob("UmVwb3J0IGEgcHJvYmxlbQ=="),
    atob(
      "QmVsb3cgYXJlIHRoZSBsaXN0IG9mIHdheXMgdG8gcmVwb3J0IGEgcHJvYmxlbSA8YnIgLz5NYWtlIHN1cmUgdG8gZ28gdGhyb3VnaCB0aGUgPGEgaHJlZj0naHR0cHM6Ly95b3V0dWJlLmNvbS9wbGF5bGlzdD9saXN0PVBMR21LTWczYVJrWGpQUjVna2x4TXlxeHRoWW9vV0k1SUMnIHRhcmdldD0nX2JsYW5rJz55b3V0dWJlIHBsYXlsaXN0PC9hPiBpZiBhbnkgc2V0dGluZ3MgYXJlIHVuY2xlYXIgPGJyIC8+"
    ),
    (t) => {
      if (t === atob("R2l0aHVi")) {
        window.open(
          atob(
            "aHR0cHM6Ly9naXRodWIuY29tL2NoaXRoYWt1bWFyMTMvRlVULUF1dG8tQnV5ZXIvaXNzdWVz"
          ),
          atob("X2JsYW5r")
        );
      } else if (t === atob("RGlzY29yZCAoQ29tbXVuaXR5KQ==")) {
        window.open(
          atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9pbnZpdGUvY2t0SFltcA=="),
          atob("X2JsYW5r")
        );
      } else if (t === atob("VHdpdHRlciAoRmFzdCBSZXNwb25zZSk=")) {
        window.open(
          atob("aHR0cHM6Ly90d2l0dGVyLmNvbS9BbGdvc0Nr"),
          atob("X2JsYW5r")
        );
      }
    }
  );
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
                idAbReportProblem,
                "Report a problem",
                () => {
                  handleReportProblem();
                },
                "call-to-action mrgRgt10"
              )}
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

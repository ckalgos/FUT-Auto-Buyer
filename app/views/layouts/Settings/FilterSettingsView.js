import {
  idAbDownloadFilter,
  idAbUploadFilter,
  idFilterDropdown,
  idAbNumberFilterSearch,
  idRunFilterSequential,
  idSelectedFilter,
  idAbToggleRunner,
  idBtnReport,
  idBtnActions,
} from "../../../elementIds.constants";
import { getValue, setValue } from "../../../services/repository";
import { getUserFilters } from "../../../utils/dbUtil";
import { uploadFilters, downloadFilters } from "../../../utils/filterSyncUtil";
import { updateMultiFilterSettings } from "../../../utils/filterUtil";
import { generateButton } from "../../../utils/uiUtils/generateButton";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import {
  deleteFilter,
  loadFilter,
  saveFilterDetails,
} from "../../../utils/userExternalUtil";
import { createButton } from "../ButtonView";
import { showPopUp } from "../../../utils/popupUtil";

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
$(document).on(
  {
    change: updateMultiFilterSettings,
    click: updateMultiFilterSettings,
    touchend: updateMultiFilterSettings,
  },
  `#${idSelectedFilter}`
);

const handleToggle = (evt, key) => {
  let runSequentially = getValue(key);
  if (runSequentially) {
    runSequentially = false;
    $(evt.currentTarget).removeClass("toggled");
  } else {
    runSequentially = true;
    $(evt.currentTarget).addClass("toggled");
  }
  setValue(key, runSequentially);
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
                <div class="price-filter buyer-settings-field multiple-filter teleporter">
                    <select  multiple="multiple" class="multiselect-filter filter-header-settings" id="${idSelectedFilter}"
                     name="selectedFilters" style="overflow-y : scroll;">
                     ${Object.keys(await filters()).map(
                       (value) => `<option value='${value}'>${value}</option>`
                     )}
                    </select>
                </div>
                ${generateTextInput(
                  "No. of search For each filter",
                  getValue("fiterSearchCount") || 3,
                  { idAbNumberFilterSearch },
                  "(Count of searches performed before switching to another filter)",
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
                  (evt) => handleToggle(evt, "runSequentially")
                )}
            </div>
    `;
};

const handleReportProblem = () => {
  showPopUp(
    [
      { labelEnum: atob("RGlzY29yZA==") },
      { labelEnum: atob("VHdpdHRlcg==") },
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
      } else if (t === atob("RGlzY29yZA==")) {
        window.open(
          atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9pbnZpdGUvY2t0SFltcA=="),
          atob("X2JsYW5r")
        );
      } else if (t === atob("VHdpdHRlcg==")) {
        window.open(
          atob("aHR0cHM6Ly90d2l0dGVyLmNvbS9BbGdvc0Nr"),
          atob("X2JsYW5r")
        );
      }
    }
  );
};

export const filterHeaderSettingsView = async function (isTransferSearch) {
  const context = this;
  const filterId = isTransferSearch ? "transfer" : "";
  $(document).off("change", `#${idFilterDropdown}${filterId}`);
  $(document).on(
    {
      change: function () {
        const filterName = $(`#${idFilterDropdown}${filterId} option`)
          .filter(":selected")
          .val();
        loadFilter.call(context, filterName, isTransferSearch);
      },
    },
    `#${idFilterDropdown}${filterId}`
  );

  const rootHeader =
    $(`<div style="width:100%;display: flex;flex-direction: column;">
            ${
              isPhone() && !isTransferSearch
                ? generateToggleInput(
                    "Runner Mode",
                    { idAbToggleRunner },
                    "",
                    "MisSettings",
                    "runner",
                    (evt) => {
                      const isToggled = handleToggle(evt, "runnerToggle");
                      $(".auto-buyer").toggleClass("displayNone");
                      if (isToggled) {
                        $(".filter-place").append($(`#${idSelectedFilter}`));
                      } else {
                        $(".teleporter").append($(`#${idSelectedFilter}`));
                      }
                    }
                  )
                : ""
            }
            ${
              !isTransferSearch
                ? `<div id=${idBtnReport} class="btn-report"></div>`
                : ""
            }         
            <div class="price-filter buyer-settings-field multiple-filter filter-place">
            </div> 
            <div class="button-container btn-filters">
                 <select class="filter-header-settings" id='${idFilterDropdown}${filterId}'>
                    <option selected="true" disabled>Choose filter to load</option>
                    ${
                      !isTransferSearch
                        ? `<option value="_default">_DEFAULT</option>`
                        : ""
                    }  
                    ${Object.keys(await filters()).map(
                      (value) => `<option value="${value}">${value}</option>`
                    )}                    
                 </select>                 
                ${
                  !isTransferSearch
                    ? generateButton(
                        idAbUploadFilter,
                        "⇧",
                        () => {
                          uploadFilters();
                        },
                        "filterSync",
                        "Upload filters"
                      )
                    : ""
                }
               ${
                 !isTransferSearch
                   ? generateButton(
                       idAbDownloadFilter,
                       "⇩",
                       () => {
                         downloadFilters();
                       },
                       "filterSync",
                       "Download filters"
                     )
                   : ""
               }
             </div> 
               ${
                 !isTransferSearch
                   ? `<div id=${idBtnActions} style="margin-top: 1%;" class="button-container btn-filters"></div>`
                   : ""
               }
             </div>`);

  !isTransferSearch && appendButtons.call(this, rootHeader, context);
  return rootHeader;
};

const appendButtons = function (rootHeader, context) {
  const buttons = rootHeader.find(`#${idBtnActions}`);
  const btnReport = rootHeader.find(`#${idBtnReport}`);
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
  btnReport.append(
    createButton(
      "Report a problem",
      () => handleReportProblem(),
      "call-to-action"
    ).__root
  );
};

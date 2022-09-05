import {
  idAbFiltersToUpload,
  idAbFiltersFileToUpload,
} from "../elementIds.constants";
import { getValue } from "../services/repository";
import { downloadJson, showLoader } from "./commonUtil";
import { showPopUp } from "./popupUtil";
import { saveFilterInDB } from "./userExternalUtil";
import { sendUINotification } from "./notificationUtil";

$(document).on(
  {
    touchend: function () {
      $(`#${idAbFiltersFileToUpload}`).trigger("click");
    },
  },
  `#${idAbFiltersFileToUpload}`
);

export const downloadFilters = () => {
  const userFilters = getValue("filters");

  let filterMessage = `Choose filters to Download <br /> <br />
  <select  multiple="multiple" class="multiselect-filter filter-header-settings" id="${idAbFiltersToUpload}"
      style="overflow-y : scroll">
      ${Object.keys(userFilters).map(
        (value) => `<option value='${value}'>${value}</option>`
      )}
   </select> <br /> <br /> <br />`;
  //  <h3>This is override/delete all the existings filters in the server</h3>`;

  showPopUp(
    [
      { labelEnum: enums.UIDialogOptions.OK },
      { labelEnum: enums.UIDialogOptions.CANCEL },
    ],
    "Download filters",
    filterMessage,
    async (text) => {
      text === 2 && (await downloadConfirm(userFilters));
    }
  );
};

const downloadConfirm = (userFilters) => {
  const filterToDownload = {};
  const selectedFilters = $(`#${idAbFiltersToUpload}`).val() || [];
  if (!selectedFilters.length) {
    sendUINotification("No filter selected", UINotificationType.NEGATIVE);
    return;
  }
  for (let filter of selectedFilters) {
    const currentFilter = userFilters[filter];
    const parsedFilter = JSON.parse(currentFilter);
    filterToDownload[filter] = parsedFilter;
  }
  downloadJson({ filters: filterToDownload }, "filters.json");
  sendUINotification("Filters downloaded successfully");
};

export const uploadFilters = () => {
  let uploadMessage = `Upload Filter Json file <br /> <br />
  <input accept=".json" type="file" id="${idAbFiltersFileToUpload}">
   </input> <br /> <br /> <br />
   Uploading filters will override filters with the same name`;
  showPopUp(
    [
      { labelEnum: enums.UIDialogOptions.OK },
      { labelEnum: enums.UIDialogOptions.CANCEL },
    ],
    "Upload filters",
    uploadMessage,
    (text) => {
      text === 2 && uploadFilterConfirm();
    }
  );
};

const uploadFilterConfirm = () => {
  const myFile = $(`#${idAbFiltersFileToUpload}`).prop("files");
  if (!myFile || !myFile[0]) {
    sendUINotification("No filter file selected", UINotificationType.NEGATIVE);
    return;
  }
  const file = myFile[0];
  const fileReader = new FileReader();
  fileReader.onload = (evt) => {
    const parsedFilters = JSON.parse(evt.target.result);
    if (!parsedFilters || !parsedFilters.filters) {
      sendUINotification("Not a valid filters file");
      return;
    }

    for (let filter in parsedFilters.filters) {
      saveFilterInDB(filter, parsedFilters.filters[filter]);
    }
    sendUINotification("Filters uploaded successfully");
  };
  fileReader.readAsText(file);
};

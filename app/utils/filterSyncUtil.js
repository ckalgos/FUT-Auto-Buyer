import {
  idAbFiltersFileToUpload,
  idAbFiltersToUpload,
} from "../elementIds.constants";
import { getValue } from "../services/repository";
import { downloadJson, hideLoader, showLoader } from "./commonUtil";
import { sendUINotification } from "./notificationUtil";
import { showPopUp } from "./popupUtil";
import { saveFilterInDB } from "./userExternalUtil";

export const uploadFiltersToServer = () => {
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
    (text) => {
      text === 2 && downloadLocal(userFilters);
    }
  );
};

export const downloadLocal = (userFilters) => {
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
  downloadJson({ filters: filterToDownload }, "filters");
  sendUINotification("Filters downloaded successfully");
};

export const uploadFiltersLocal = () => {
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
      text === 2 && uploadLocalFilterConfirm();
    }
  );
};

const uploadLocalFilterConfirm = () => {
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

export const downloadFiltersFromServer = () => {
  showPopUp(
    [
      { labelEnum: enums.UIDialogOptions.OK },
      { labelEnum: enums.UIDialogOptions.CANCEL },
    ],
    "Download filters",
    "Downloading filters will override local filter with the same name",
    async (text) => {
      text === 2 && (await downloadConfirm());
    }
  );
};

const downloadConfirm = async () => {
  showLoader();
  const userFilters = await downloadFilters();
  const parsedFilters = await userFilters.json();

  if (!parsedFilters || !parsedFilters.filters) {
    sendUINotification("No filters found in server");
    hideLoader();
    return;
  }

  for (let filter in parsedFilters.filters) {
    saveFilterInDB(filter, parsedFilters.filters[filter]);
  }

  sendUINotification("Filters downloaded successfully");
  hideLoader();
};

const downloadFilters = async () => {
  const url = atob(
    "aHR0cHM6Ly92YnAwOHc3M3IwLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2Rldi9maWx0ZXJz"
  );
  const userToken = await getUserAccessToken();
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
    method: "GET",
  });
};

const uploadFilters = async (userFilters) => {
  const filterToUpload = {};
  const selectedFilters = $(`#${idAbFiltersToUpload}`).val() || [];
  if (!selectedFilters.length) {
    sendUINotification("No filter selected", UINotificationType.NEGATIVE);
    return;
  }
  if (selectedFilters.length > 5) {
    sendUINotification(
      "Cannot upload more than 5 filter",
      UINotificationType.NEGATIVE
    );
    return;
  }
  for (let filter of selectedFilters) {
    const currentFilter = userFilters[filter];
    const parsedFilter = JSON.parse(currentFilter);
    filterToUpload[filter] = parsedFilter;
  }
  showLoader();
  const response = await sendRequest(
    atob(
      "aHR0cHM6Ly92YnAwOHc3M3IwLmV4ZWN1dGUtYXBpLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tL2Rldi9maWx0ZXI="
    ),
    { filters: filterToUpload }
  );

  if (response.status === 201) {
    sendUINotification("Filters uploaded successfully");
  } else {
    sendUINotification("Error uploading filters", UINotificationType.NEGATIVE);
  }
  hideLoader();
};

const sendRequest = async (url, payload) => {
  const userToken = await getUserAccessToken();
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
};

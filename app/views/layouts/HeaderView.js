import {
  idAbStatus,
  idAbRequestCount,
  idInfoWrapper,
  idAbSearchProgress,
  idAbStatisticsProgress,
  idAbCoins,
  idAbSoldItems,
  idAbUnsoldItems,
  idAbAvailableItems,
  idAbActiveTransfers,
} from "../../elementIds.constants";

export const BuyerStatus = () => {
  return `<span style='color:red' id="${idAbStatus}"> IDLE </span> | REQUEST COUNT: <span id="${idAbRequestCount}">0</span> 
  `;
};

export const HeaderView = () => {
  return (
    "<style>" +
    ".ut-navigation-container-view--content>* { height: calc(100% - 4rem); }" +
    ".ut-content-container .ut-content { max-height: none !important; }" +
    "</style>" +
    '<div id="' +
    idInfoWrapper +
    '" class="ut-navigation-bar-view navbar-style-landscape">' +
    '   <h1 class="title">AUTOBUYER STATUS: <span id="' +
    idAbStatus +
    '"></span> | REQUEST COUNT: <span id="' +
    idAbRequestCount +
    '">0</span></h1>' +
    '   <div class="view-navbar-clubinfo">' +
    '       <div class="view-navbar-clubinfo-data">' +
    '           <div class="view-navbar-clubinfo-id">' +
    '               <div style="float: left;">Search:</div>' +
    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
    '                   <div id="' +
    idAbSearchProgress +
    '" style="background: #000; height: 10px; width: 0%"></div>' +
    "               </div>" +
    "           </div>" +
    '           <div class="view-navbar-clubinfo-id">' +
    '               <div style="float: left;">Statistics:</div>' +
    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
    '                   <div id="' +
    idAbStatisticsProgress +
    '" style="background: #000; height: 10px; width: 0%"></div>' +
    "               </div>" +
    "           </div>" +
    "       </div>" +
    "   </div>" +
    '   <div class="view-navbar-currency" style="margin-left: 10px;">' +
    '       <div class="view-navbar-currency-coins" id="' +
    idAbCoins +
    '"></div>' +
    "   </div>" +
    '   <div class="view-navbar-clubinfo">' +
    '       <div class="view-navbar-clubinfo-data">' +
    '           <span class="view-navbar-clubinfo-id">Sold Items: <span id="' +
    idAbSoldItems +
    '"></span></span>' +
    '           <span class="view-navbar-clubinfo-id">Unsold Items: <span id="' +
    idAbUnsoldItems +
    '"></span></span>' +
    "       </div>" +
    "   </div>" +
    '   <div class="view-navbar-clubinfo" style="border: none;">' +
    '       <div class="view-navbar-clubinfo-data">' +
    '           <span class="view-navbar-clubinfo-id">Available Items: <span id="' +
    idAbAvailableItems +
    '"></span></span>' +
    '           <span class="view-navbar-clubinfo-id">Active transfers: <span id="' +
    idAbActiveTransfers +
    '"></span></span>' +
    "       </div>" +
    "   </div>" +
    "</div>"
  );
};

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
  idAbProfit,
  idAbCountDown,
  idAbDownloadStats,
} from "../../elementIds.constants";
import { downloadStats } from "../../utils/statsUtil";
import { generateButton } from "../../utils/uiUtils/generateButton";

export const BuyerStatus = () => {
  return `<span style='color:red' id="${idAbStatus}"> IDLE </span> | REQUEST COUNT: <span id="${idAbRequestCount}">0</span> 
  `;
};

export const HeaderView = () => {
  return `
  <div class="view-navbar-clubinfo-data">
    <div class="view-navbar-clubinfo-name">
    ${generateButton(
      idAbDownloadStats,
      "⇩",
      () => {
        downloadStats();
      },
      "filterSync",
      "Download Stats"
    )}
    </div>
  </div>
  <div class="view-navbar-clubinfo">
    <div class="view-navbar-clubinfo-data">
      <div class="view-navbar-clubinfo-name">
        <span id=${idAbCountDown} style="font-weight: bold;">00:00:00</span>
      </div>
    </div>
  </div>
  <div class="view-navbar-clubinfo">
    <div class="view-navbar-clubinfo-data">
       <div class="view-navbar-clubinfo-name">
          <div style="float: left;">Search:</div>
          <div class="stats-progress">
             <div id=${idAbSearchProgress} class="stats-fill"></div>
          </div>
       </div>
       <div class="view-navbar-clubinfo-name">
          <div style="float: left;">Statistics:</div>
          <div class="stats-progress">
             <div id=${idAbStatisticsProgress} class="stats-fill"></div>
          </div>     
       </div>
    </div>
  </div>
  <div class="view-navbar-currency" style="margin-left: 10px;">
    <div class="view-navbar-currency-coins">Coins: <span  id=${idAbCoins}></span></div>
    <div class="view-navbar-currency-coins">Profit: <span  id=${idAbProfit}></span></div>
  </div>
  <div class="view-navbar-clubinfo">
    <div class="view-navbar-clubinfo-data">
       <span class="view-navbar-clubinfo-name">Sold Items: <span id=${idAbSoldItems}></span></span>
       <span class="view-navbar-clubinfo-name">Unsold Items: <span id=${idAbUnsoldItems}></span></span>
    </div>
  </div>
  <div class="view-navbar-clubinfo" style="border: none;">
    <div class="view-navbar-clubinfo-data">
       <span class="view-navbar-clubinfo-name">Available Items: <span id=${idAbAvailableItems}></span></span>
       <span class="view-navbar-clubinfo-name">Active transfers: <span id=${idAbActiveTransfers}></span></span>
    </div>
  </div>`;
};

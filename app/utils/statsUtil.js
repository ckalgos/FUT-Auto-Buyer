import { getValue, setValue } from "../services/repository";
import { downloadCsv } from "./commonUtil";

export const updateRequestCount = () => {
  const currentStats = getValue("sessionStats");
  currentStats["searchCount"]++;
  setValue("sessionStats", currentStats);
};

export const updateProfit = (val) => {
  const currentStats = getValue("sessionStats");
  currentStats["profit"] += val;
  setValue("sessionStats", currentStats);
};

export const appendTransactions = (val) => {
  const currentStats = getValue("sessionStats");
  currentStats["transactions"] = currentStats["transactions"] || [];
  currentStats["transactions"].push(val);
  setValue("sessionStats", currentStats);
};

export const downloadStats = () => {
  const { coinsNumber, searchCount, profit, runningTime, transactions } =
    getValue("sessionStats");
  const winCount = getValue("winCount");
  const bidCount = getValue("bidCount");
  const lossCount = getValue("lossCount");
  let csvContent =
    "Script Version,Available Coins,Search Count,Profit,Running Time,BIN Won Count,BID Won Count,Loss Count\r\n";
  csvContent += `${GM_info.script.version},${coinsNumber || ""},${
    searchCount || ""
  },${profit || 0},${runningTime || ""},${winCount || 0},${bidCount || 0},${
    lossCount || 0
  }\r\n\r\n`;
  csvContent += `Transactions\r\n`;
  csvContent += transactions.map((transact) => `${transact}\r\n`).join("");
  downloadCsv(csvContent, "Stats");
};

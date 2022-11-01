import { getValue, setValue } from "../services/repository";
import { downloadCsv } from "./commonUtil";

export const updateRequestCount = () => {
  const currentStats = getValue("sessionStats");
  currentStats["searchCount"]++;
  currentStats["searchPerMinuteCount"]++;
  setValue("sessionStats", currentStats);
};

export const updateProfit = (val) => {
  const currentStats = getValue("sessionStats");
  currentStats["profit"] += val;
  setValue("sessionStats", currentStats);
};

export const resetProfit = () => {
  const currentStats = getValue("sessionStats");
  currentStats["profit"] = 0;
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
    "Available Coins,Search Count,Profit,Running Time,BIN Won Count,BID Won Count,Loss Count\n";
  csvContent += `${coinsNumber || ""},${searchCount || ""},${profit || 0},${
    runningTime || ""
  },${winCount || 0},${bidCount || 0},${lossCount || 0}\n\n`;
  csvContent += `Transactions\n`;
  csvContent += transactions.map((transact) => `${transact}\n`).join("");
  downloadCsv(csvContent, "Stats");
};

setInterval(() => {
  const currentStats = getValue("sessionStats");
  currentStats["searchPerMinuteCount"] = 0;
  setValue("sessionStats", currentStats);
}, 55000);

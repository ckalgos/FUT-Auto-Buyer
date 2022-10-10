import { getDataSource } from "../repository";
import futwiz from "./futwiz";
import futbin from "./futbin";

export const fetchPrices = async (items) => {
  const dataSource = getDataSource();

  if (dataSource === "FUTWIZ") {
    return futwiz.fetchPrices(items);
  } else if (dataSource === "FUTBIN") {
    return futbin.fetchPrices(items);
  }
};

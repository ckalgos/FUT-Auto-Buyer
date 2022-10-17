import phoneDBUtil from "./phoneDBUtil";

export const initDatabase = () => phoneDBUtil.initDatabase();

export const getUserFilters = (storeName = "Filters") =>
  phoneDBUtil.getUserFilters(storeName);

export const insertFilters = (filterName, jsonData, storeName = "Filters") =>
  phoneDBUtil.insertFilters(filterName, jsonData, storeName);

export const deleteFilters = (filterName) =>
  phoneDBUtil.deleteFilters(filterName);

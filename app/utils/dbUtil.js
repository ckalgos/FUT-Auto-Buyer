import webDBUtil from "./webDBUtil";
import phoneDBUtil from "./phoneDBUtil";

export const initDatabase = () =>
  isPhone() ? phoneDBUtil.initDatabase() : phoneDBUtil.initDatabase();

export const getUserFilters = (storeName = "Filters") =>
  isPhone()
    ? phoneDBUtil.getUserFilters(storeName)
    : phoneDBUtil.getUserFilters(storeName);

export const insertFilters = (filterName, jsonData, storeName = "Filters") =>
  isPhone()
    ? phoneDBUtil.insertFilters(filterName, jsonData, storeName)
    : phoneDBUtil.insertFilters(filterName, jsonData, storeName);

export const deleteFilters = (filterName) =>
  isPhone()
    ? phoneDBUtil.deleteFilters(filterName)
    : phoneDBUtil.deleteFilters(filterName);

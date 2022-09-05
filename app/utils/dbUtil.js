import webDBUtil from "./webDBUtil";
import phoneDBUtil from "./phoneDBUtil";

export const initDatabase = () =>
  isPhone() ? phoneDBUtil.initDatabase() : webDBUtil.initDatabase();

export const getUserFilters = (storeName = "Filters") =>
  isPhone()
    ? phoneDBUtil.getUserFilters(storeName)
    : webDBUtil.getUserFilters(storeName);

export const insertFilters = (filterName, jsonData, storeName = "Filters") =>
  isPhone()
    ? phoneDBUtil.insertFilters(filterName, jsonData, storeName)
    : webDBUtil.insertFilters(filterName, jsonData, storeName);

export const deleteFilters = (filterName) =>
  isPhone()
    ? phoneDBUtil.deleteFilters(filterName)
    : webDBUtil.deleteFilters(filterName);

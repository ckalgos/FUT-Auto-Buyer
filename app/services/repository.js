const lookUp = new Map();

export const setValue = (key, value) => {
  lookUp.set(key, value);
};

export const getValue = (key) => {
  const value = lookUp.get(key);
  if (value && value.expiryTimeStamp && value.expiryTimeStamp < Date.now()) {
    lookUp.delete(key);
    return null;
  }
  return value;
};

export const getBuyerSettings = (ignoreCommonSetting = false) => {
  const buyerSetting = getValue("BuyerSettings") || {};
  if (ignoreCommonSetting) {
    return buyerSetting;
  }
  const commonSettings = getValue("CommonSettings") || {};
  return Object.assign({}, buyerSetting, commonSettings);
};

export const increAndGetStoreValue = (key) => {
  let storeValue = getValue(key) || 0;
  storeValue++;
  setValue(key, storeValue);
  return storeValue;
};

export const getDataSource = () => {
  const commonSettings = getValue("CommonSettings") || {};
  return (commonSettings["idAbUseFutWiz"] ? "futwiz" : "futbin").toUpperCase();
};

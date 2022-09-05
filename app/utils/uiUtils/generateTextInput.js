import { getValue, setValue } from "../../services/repository";
let eventMappers = new Set();

const updateCache = (key, settingKey, value, type, isDefaultValue = false) => {
  const buyerSetting = getValue(settingKey) || {};
  if (type === "number") value = parseInt(value);
  buyerSetting[key] = value || null;
  buyerSetting[key + "isDefaultValue"] = isDefaultValue;
  setValue(settingKey, buyerSetting);
};

export const generateTextInput = (
  label,
  placeholder,
  id,
  info,
  settingKey,
  type = "number",
  pattern = ".*",
  additionalClasses = "buyer-settings-field",
  customCallBack = null
) => {
  const key = Object.keys(id)[0];
  if (placeholder) {
    customCallBack && customCallBack(placeholder);
    updateCache(key, settingKey, placeholder, type, true);
  }
  if (!eventMappers.has(key)) {
    $(document).on("input", `#${id[key]}`, ({ target: { value } }) => {
      customCallBack && customCallBack(value);
      updateCache(key, settingKey, value || placeholder, type, !value);
    });
    eventMappers.add(key);
  }
  return `<div class="price-filter ${additionalClasses}">
       <div class="info">
           <span class="secondary label">${label} :<br/><small>${info}</small></span>
       </div>
       <div class="buttonInfo">
           <div class="inputBox">
               <input pattern="${pattern}" type="${type}" class="numericInput" id='${id[key]}' placeholder=${placeholder}>
           </div>
       </div>
    </div>`;
};

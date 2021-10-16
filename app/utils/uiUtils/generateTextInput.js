import { getValue, setValue } from "../../services/repository";
let eventMappers = new Set();

const updateCache = (key, value, type, isDefaultValue = false) => {
  const buyerSetting = getValue("BuyerSettings") || {};
  if (type === "number") value = parseInt(value);
  buyerSetting[key] = value || null;
  buyerSetting[key + "isDefaultValue"] = isDefaultValue;
  setValue("BuyerSettings", buyerSetting);
};

export const generateTextInput = (
  label,
  placeholder,
  id,
  info,
  type = "number",
  pattern = "*",
  additionalClasses = "buyer-settings-field",
  customCallBack = null
) => {
  const key = Object.keys(id)[0];
  if (placeholder) {
    customCallBack && customCallBack(placeholder);
  }
  updateCache(key, placeholder, type, true);
  if (!eventMappers.has(key)) {
    $(document).on("input", `#${id[key]}`, ({ target: { value } }) => {
      customCallBack && customCallBack(value);
      updateCache(key, value || placeholder, type, !value);
    });
    eventMappers.add(key);
  }
  if (!eventMappers.has(`${key}_tooltip`)) {
    $(document).on("click touchend", `#${id[key]}_tooltip`, () => {
      const fragment = label.replace(/\s/g, "-");
      window.open(
        `https://github.com/chithakumar13/FUT-Auto-Buyer#${fragment}`,
        "_blank"
      );
    });
    eventMappers.add(`${key}_tooltip`);
  }
  return `<div class="price-filter ${additionalClasses}">
       <div class="info">
           <span class="secondary label"><button id='${id[key]}_tooltip' style="font-size:16px" class="flat camel-case">${label}</button> :<br/><small>${info}</small></span>
       </div>
       <div class="buttonInfo">
           <div class="inputBox">
               <input pattern="${pattern}" type="${type}" class="numericInput" id='${id[key]}' placeholder=${placeholder}>
           </div>
       </div>
    </div>`;
};

import { getValue, setValue } from "../../services/repository";
let eventMappers = new Set();

const clickHandler = (key, settingKey, evt) => {
  const buyerSetting = getValue(settingKey) || {};
  if (buyerSetting[key]) {
    buyerSetting[key] = false;
    $(evt.currentTarget).removeClass("toggled");
  } else {
    buyerSetting[key] = true;
    $(evt.currentTarget).addClass("toggled");
  }
  setValue(settingKey, buyerSetting);
  return buyerSetting[key];
};

export const generateToggleInput = (
  label,
  id,
  info,
  settingKey,
  additionalClasses = "buyer-settings-field",
  customCallBack = null
) => {
  const key = Object.keys(id)[0];
  if (!eventMappers.has(key)) {
    $(document).on("click touchend", `#${id[key]}`, (evt) => {
      !customCallBack && clickHandler(key, settingKey, evt);
      customCallBack && customCallBack(evt);
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
  return `
    <div class="price-filter  ${additionalClasses}">
        <div class="ut-toggle-cell-view">
           <span class="ut-toggle-cell-view--label"><button id='${id[key]}_tooltip' style="font-size:16px" class="flat camel-case">${label}</button> <br/><small>${info}</small></span>
             <div id='${id[key]}' class="ut-toggle-control">
               <div class="ut-toggle-control--track">
              </div>
              <div class= "ut-toggle-control--grip" >
          </div> 
           </div> 
       </div>
    </div> `;
};

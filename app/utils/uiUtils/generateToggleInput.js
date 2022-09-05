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
  return `
    <div class="price-filter  ${additionalClasses}">
        <div class="ut-toggle-cell-view">
           <span class="ut-toggle-cell-view--label">${label} <br/><small>${info}</small></span>
             <div id='${id[key]}' class="ut-toggle-control">
               <div class="ut-toggle-control--track">
              </div>
              <div class= "ut-toggle-control--grip" >
          </div> 
           </div> 
       </div>
    </div> `;
};

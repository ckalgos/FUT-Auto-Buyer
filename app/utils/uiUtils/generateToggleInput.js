import { getValue, setValue } from "../../services/repository";

const clickHandler = (key, evt) => {
  const buyerSetting = getValue("BuyerSettings") || {};
  if (buyerSetting[key]) {
    buyerSetting[key] = false;
    jQuery(evt.currentTarget).removeClass("toggled");
  } else {
    buyerSetting[key] = true;
    jQuery(evt.currentTarget).addClass("toggled");
  }
  setValue("BuyerSettings", buyerSetting);
};

export const generateToggleInput = (
  label,
  id,
  info,
  additionalClasses = "buyer-settings-field"
) => {
  const key = Object.keys(id)[0];
  jQuery(document).on("click", `#${id[key]}`, (evt) => {
    clickHandler(key, evt);
  });
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

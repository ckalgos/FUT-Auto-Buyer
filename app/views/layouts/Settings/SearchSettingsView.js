import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import {
  idAbAddFilterGK,
  idAbMinRating,
  idAbMaxRating,
  idAbRandMinBidInput,
  idAbRandMinBidToggle,
  idAbRandMinBuyInput,
  idAbRandMinBuyToggle,
  idAbMaxSearchPage,
  idAddIgnorePlayers,
  idAddIgnorePlayersList,
  idRemoveIgnorePlayers,
  idAbIgnoreAllowToggle,
  idTooltip,
  idAbShouldSort,
  idAbSortBy,
  idAbSortOrder,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { checkAndAppendOption } from "../../../utils/filterUtil";
import { getValue, setValue } from "../../../services/repository";
import { generateButton } from "../../../utils/uiUtils/generateButton";
let playerInput;

export const destoryPlayerInput = () => {
  playerInput.destroy();
  playerInput = null;
};

const updateAbSortBy = () => {
  const sortBy = $(`#${idAbSortBy}`).val() || "buy";
  const buyerSetting = getValue("BuyerSettings") || {};
  buyerSetting["idAbSortBy"] = sortBy;
  setValue("BuyerSettings", buyerSetting);
};

$(document).on({ change: updateAbSortBy }, `#${idAbSortBy}`);

const playerIgnoreList = function () {
  playerInput = new UTPlayerSearchControl();
  const playerListId = `#${idAddIgnorePlayersList}`;
  const element = $(`
            <div class="price-filter buyer-settings-field">
              <div class="info">
               <span class="secondary label">
                  <button id=${idTooltip} style="font-size:16px" class="flat camel-case">Players List</button><br/>
                </span>
              </div>
              <div class="ignore-players displayCenterFlx">
                ${generateButton(
                  idAddIgnorePlayers,
                  "+",
                  () => {
                    const displayName = `${playerInput._playerNameInput.value}(${playerInput.selected.rating})`;
                    const exists = checkAndAppendOption(
                      playerListId,
                      displayName
                    );
                    $(`${playerListId} option[value="${displayName}"]`).attr(
                      "selected",
                      true
                    );
                    if (!exists) {
                      const buyerSetting = getValue("BuyerSettings") || {};
                      const existingPlayersList =
                        buyerSetting["idAddIgnorePlayersList"] || [];
                      existingPlayersList.push({
                        id: playerInput.selected.id,
                        displayName,
                      });
                      buyerSetting["idAddIgnorePlayersList"] =
                        existingPlayersList;
                      setValue("BuyerSettings", buyerSetting);
                    }
                  },
                  "btn-standard filterSync action-icons"
                )}                
                </div>
              </div>
              <div class="price-filter buyer-settings-field">
                <div class="info">
                <span class="secondary label">
                  <button id=${idTooltip} style="font-size:16px" class="flat camel-case">Remove from Players List</button><br/>
                </span>
                </div>
                <div class="displayCenterFlx">
                  <select style="width:90%;height: 3rem;font-size: 1.5rem;" class="filter-header-settings" id=${idAddIgnorePlayersList}>
                    <option selected="true" disabled>Players List</option>                            
                  </select>
                  ${generateButton(
                    idRemoveIgnorePlayers,
                    "❌",
                    () => {
                      const playerName = $(`${playerListId} option`)
                        .filter(":selected")
                        .val();
                      if (playerName != "Ignored Players List") {
                        $(
                          `${playerListId}` + ` option[value="${playerName}"]`
                        ).remove();
                        $(`${playerListId}`).prop("selectedIndex", 0);
                        const buyerSetting = getValue("BuyerSettings") || {};
                        let existingPlayersList =
                          buyerSetting["idAddIgnorePlayersList"] || [];
                        existingPlayersList = existingPlayersList.filter(
                          ({ displayName }) => displayName != playerName
                        );
                        buyerSetting["idAddIgnorePlayersList"] =
                          existingPlayersList;
                        setValue("BuyerSettings", buyerSetting);
                      }
                    },
                    "btn-standard filterSync font15 action-icons"
                  )}
                </div>
              </div>              
              `);

  $(playerInput.__root).insertBefore(element.find(`#${idAddIgnorePlayers}`));
  playerInput.init();
  playerInput._playerNameInput.setPlaceholder("Search Players");
  return element;
};

export const searchSettingsView = function () {
  const element =
    $(`<div style='display : none' class='buyer-settings-wrapper results-filter-view'>
    <div class="place-holder">
    </div>
    ${generateToggleInput(
      "Ignore/Buy Players List",
      { idAbIgnoreAllowToggle },
      "(If toggled bot will only buy/bid the above players else bot will ignore the players when bidding/buying )",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Min Rating",
      10,
      { idAbMinRating },
      "Minimum Player Rating",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Max Rating",
      100,
      { idAbMaxRating },
      "Maximum Player Rating",
      "BuyerSettings"
    )}    
    ${generateTextInput(
      "Search result page limit",
      5,
      { idAbMaxSearchPage },
      "No of. pages bot should move forward before going back to page 1",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Max value of random min bid",
      300,
      { idAbRandMinBidInput },
      "",
      "BuyerSettings"
    )}
    ${generateToggleInput(
      "Use random min bid",
      { idAbRandMinBidToggle },
      "",
      "BuyerSettings"
    )}
    ${generateTextInput(
      "Max value of random min buy",
      300,
      { idAbRandMinBuyInput },
      "",
      "BuyerSettings"
    )}
    ${generateToggleInput(
      "Use random min buy",
      { idAbRandMinBuyToggle },
      "",
      "BuyerSettings"
    )}
    ${generateToggleInput(
      "SKIP GK",
      { idAbAddFilterGK },
      "(Skip all goalkeepers to buy / bid a card)",
      "BuyerSettings"
    )}
    ${generateToggleInput(
      "Sort players",
      { idAbShouldSort },
      "",
      "BuyerSettings"
    )}
    <div class="price-filter buyer-settings-field">
      <div class="displayCenterFlx">
      <select style="width:95%;height: 3rem;font-size: 1.5rem;" class="select-sortBy filter-header-settings" id="${idAbSortBy}">
        <option disabled selected>--Select Sort Attribute--</option>
        <option value="expires">Expires on</option>          
        <option value="buy">Buy now price</option>
        <option value="bid">Bid now price</option>
        <option value="rating">Player rating</option>
      </select>
      </div>
    </div>
    ${generateToggleInput(
      "Order",
      { idAbSortOrder },
      "(Enabled = descending, Disabled = ascending)",
      "BuyerSettings"
    )}
  </div>`);

  const parentEl = element.find(".place-holder");
  playerIgnoreList().insertAfter(parentEl);
  return element;
};

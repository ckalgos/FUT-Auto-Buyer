import { generateToggleInput } from "../../../utils/uiUtils/generateToggleInput";
import { generateButton } from "../../../utils/uiUtils/generateButton";
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
  idAddAllowedPlayers,
  idAddAllowedPlayersList,
  idRemoveAllowedPlayers,
} from "../../../elementIds.constants";
import { generateTextInput } from "../../../utils/uiUtils/generateTextInput";
import { checkAndAppendOption } from "../../../utils/filterUtil";
import { getValue, setValue } from "../../../services/repository";
let playerInput;

export const destoryPlayerInput = () => {
  playerInput.destroy();
  playerInput = null;
};
const playerIgnoreList = function () {
  playerInput = new UTPlayerSearchControl();
  const playerListId = `#${idAddIgnorePlayersList}`;
  const element = $(`
            <div class="price-filter buyer-settings-field">
              <div class="info">
               <span class="secondary label">
                  <button id='idAddIgnorePlayers_tooltip' style="font-size:16px" class="flat camel-case">Players To Ignore</button><br/>
                  <small>Players to avoid Bidding/Buying</small>
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
                  <button id='idAddIgnorePlayers_tooltip' style="font-size:16px" class="flat camel-case">Remove from Ignore List</button><br/>
                <small><br/></small>
              </span>
                </div>
                <div class="displayCenterFlx">
                  <select style="width:90%;height: 3rem;font-size: 1.5rem;" class="filter-header-settings" id=${idAddIgnorePlayersList}>
                    <option selected="true" disabled>Ignored Players List</option>                            
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
  playerInput._playerNameInput.setPlaceholder("Search Player To Ignore");
  return element;
};

const playerAllowedList = function () {
  playerInput = new UTPlayerSearchControl();
  const playerListId = `#${idAddAllowedPlayersList}`;
  const element = $(`
            <div class="price-filter buyer-settings-field">
              <div class="info">
               <span class="secondary label">
                  <button id='idAddAllowedPlayers_tooltip' style="font-size:16px" class="flat camel-case">Players To Allowed</button><br/>
                  <small>Players to avoid Bidding/Buying</small>
                </span>
              </div>
              <div class="ignore-players displayCenterFlx">
                ${generateButton(
                  idAddAllowedPlayers,
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
                        buyerSetting["idAddAllowedPlayersList"] || [];
                      existingPlayersList.push({
                        id: playerInput.selected.id,
                        displayName,
                      });
                      buyerSetting["idAddAllowedPlayersList"] =
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
                  <button id='idAddAllowedPlayers_tooltip' style="font-size:16px" class="flat camel-case">Remove from Allowed List</button><br/>
                <small><br/></small>
              </span>
                </div>
                <div class="displayCenterFlx">
                  <select style="width:90%;height: 3rem;font-size: 1.5rem;" class="filter-header-settings" id=${idAddAllowedPlayersList}>
                    <option selected="true" disabled>Allowed Players List</option>                            
                  </select>
                  ${generateButton(
                    idRemoveAllowedPlayers,
                    "❌",
                    () => {
                      const playerName = $(`${playerListId} option`)
                        .filter(":selected")
                        .val();
                      if (playerName != "Allowed Players List") {
                        $(
                          `${playerListId}` + ` option[value="${playerName}"]`
                        ).remove();
                        $(`${playerListId}`).prop("selectedIndex", 0);
                        const buyerSetting = getValue("BuyerSettings") || {};
                        let existingPlayersList =
                          buyerSetting["idAddAllowedPlayersList"] || [];
                        existingPlayersList = existingPlayersList.filter(
                          ({ displayName }) => displayName != playerName
                        );
                        buyerSetting["idAddAllowedPlayersList"] =
                          existingPlayersList;
                        setValue("BuyerSettings", buyerSetting);
                      }
                    },
                    "btn-standard filterSync font15 action-icons"
                  )}
                </div>
              </div>              
              `);

  $(playerInput.__root).insertBefore(element.find(`#${idAddAllowedPlayers}`));
  playerInput.init();
  playerInput._playerNameInput.setPlaceholder("Search Player To Allow");
  return element;
};

export const searchSettingsView = function () {
  const element =
    $(`<div style='display : none' class='buyer-settings-wrapper results-filter-view'>  
    <hr class="search-price-header header-hr">
    <div class="search-price-header place-holder">
      <h1 class="secondary">Search Settings:</h1>
    </div>
  
    ${generateTextInput(
      "Min Rating",
      10,
      { idAbMinRating },
      "Minimum Player Rating"
    )}
    ${generateTextInput(
      "Max Rating",
      100,
      { idAbMaxRating },
      "Maximum Player Rating"
    )}
    ${generateTextInput(
      "Max value of random min bid",
      300,
      { idAbRandMinBidInput },
      ""
    )}
    ${generateToggleInput("Use random min bid", { idAbRandMinBidToggle }, "")}
    ${generateTextInput(
      "Max value of random min buy",
      300,
      { idAbRandMinBuyInput },
      ""
    )}
    ${generateToggleInput("Use random min buy", { idAbRandMinBuyToggle }, "")}
    ${generateTextInput(
      "Search result page limit",
      5,
      { idAbMaxSearchPage },
      "No of. pages bot should move <br /> forward before going back to page 1"
    )}
    ${generateToggleInput(
      "SKIP GK",
      { idAbAddFilterGK },
      "(Skip all goalkeepers <br/> to buy / bid a card)"
    )}
  </div>`);

  const parentEl = element.find(".place-holder");
  playerIgnoreList().insertAfter(parentEl);
  playerAllowedList().insertAfter(parentEl);
  return element;
};

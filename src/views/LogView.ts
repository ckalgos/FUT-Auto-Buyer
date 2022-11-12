import { Logger } from "../classes/Logger";
import { find, htmlToElement } from "../utils/UI/dom/dom.util";
import { createButton } from "../utils/UI/EA/createButton";

export const logView = () => {
  const logContainer = htmlToElement(`<div style=${
    !isPhone()
      ? "width:48%"
      : "height: 90%;display: flex;flex-direction: column;padding: 7px;"
  }  >
            <div class="logs-container">
              <label>Logs:</label>
              <div data-title="Clear logs" class="button-clear">
              </div>
            </div>
            <br/>
            <div class="logWrapper">
              <div wrap="off"  style="height: 100%;overflow-x: auto;resize: none; width: 100%;" readonly class="autoBuyerLog"></div>
              <a class="joinServer" target="_blank" rel="noopener noreferrer" href="https://discord.com/invite/cktHYmp">Join Our Discord Server</a>
            <br/>
        </div>`);
  const buttons = find(".button-clear", logContainer);
  buttons?.append(createButton("⎚", () => Logger.clear()).getRootElement());
  return logContainer;
};

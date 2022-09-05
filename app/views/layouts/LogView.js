import { idProgressAutobuyer } from "../../elementIds.constants";
import { clearLogs } from "../../utils/logUtil";
import { createButton } from "./ButtonView";

export const logView = () => {
  const logContainer = $(`<div style=${
    !isPhone()
      ? "width:48%"
      : "height: 90%;display: flex;flex-direction: column;padding: 7px;"
  }>
            <div class="logs-container">
              <label>Logs:</label>
              <div data-title="Clear logs" class="button-clear">
              </div>
            </div>
            <br/>
            <div class="logWrapper">
              <textarea wrap="off"  style="height: 100%;overflow-x: auto;resize: none; width: 100%;" readonly id=${idProgressAutobuyer} class="autoBuyerLog"></textarea>
              <a class="joinServer" target="_blank" rel="noopener noreferrer" href="https://discord.com/invite/cktHYmp">Join Our Discord Server</a>
            <br/>
        </div>`);
  const buttons = logContainer.find(".button-clear");
  buttons.append(createButton("⎚", () => clearLogs()).__root);
  return logContainer;
};

export const initializeLog = () => {
  const log = $("#" + idProgressAutobuyer);
  let time_txt = "[" + new Date().toLocaleTimeString() + "] ";
  let log_init_text = `Autobuyer Ready ${time_txt}\n`;
  log.val(log_init_text);
};

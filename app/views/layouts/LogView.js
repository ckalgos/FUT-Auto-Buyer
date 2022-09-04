import {
  idAutoBuyerFoundLog,
  idProgressAutobuyer,
} from "../../elementIds.constants";

export const logView = () => {
  return `<div ${!isPhone() ? "style=width:48%" : ""}>
            <div class="logWrapper">
            <textarea readonly id=${idProgressAutobuyer} class="autoBuyerLog"></textarea>
            <a class="joinServer" target="_blank" rel="noopener noreferrer" href="https://discord.com/invite/cktHYmp">Join Our Discord Server</a>
            </div>
            <label>Search Results:</label>
            <br/>
            <textarea readonly id=${idAutoBuyerFoundLog} class="autoBuyerLog searchLog"></textarea>
        </div>`;
};

export const initializeLog = () => {
  const log = $("#" + idProgressAutobuyer);
  let time_txt = "[" + new Date().toLocaleTimeString() + "] ";
  let log_init_text =
    "Autobuyer Ready\n" +
    time_txt +
    " Index  | Item name       | price  | op  | result  | comments\n";
  log.val(log_init_text);
};

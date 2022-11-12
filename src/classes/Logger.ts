import { UINotificationTypeEnum } from "../types/enums/enums";
import { find, htmlToElement } from "../utils/UI/dom/dom.util";

export class Logger {
  static {
    this.writeToLog("Autobuyer Ready");
  }
  static writeToLog(
    message: string,
    messageType: UINotificationTypeEnum = UINotificationTypeEnum.NEUTRAL
  ) {
    setTimeout(() => {
      const log = find(".autoBuyerLog");
      message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
      if (log) {
        log.append(
          htmlToElement(
            `<div style='color:${this.getColorByType(
              messageType
            )}'>${message}</div>`
          )
        );
        log.scrollTop = log.scrollHeight;
      }
    }, 50);
  }

  static clear() {
    const log = find(".autoBuyerLog");
    log && (log.textContent = "");
  }

  private static getColorByType(messageType: UINotificationTypeEnum) {
    if (messageType === UINotificationTypeEnum.POSITIVE) {
      return "#36b84b";
    } else if (messageType === UINotificationTypeEnum.NEGATIVE) {
      return "#d31332";
    }
    return "#f2f2f2";
  }
}

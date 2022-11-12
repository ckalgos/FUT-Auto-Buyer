import { UINotificationTypeEnum } from "../../types/enums/enums";
import { Notification } from "../../types/interfaces/autobuyer/Notification.interface";

export class UINotification implements Notification {
  notify(
    message: string,
    notificationType: UINotificationTypeEnum = UINotificationTypeEnum.NEUTRAL
  ) {
    setTimeout(() => {
      services.Notification.queue([message, notificationType]);
    }, 250);
  }
}

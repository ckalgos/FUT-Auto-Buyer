import { UINotificationTypeEnum } from "../../enums/enums";

export interface Notification {
  notify(message: string, messageType: UINotificationTypeEnum): void;
}

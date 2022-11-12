import { Item } from "./item.interface";
import { Localization } from "./localization.interface";
import { Notification } from "./notification.interface";
import { PIN } from "./pinEvent.interface";

export interface Services {
  Localization?: Localization;
  Item: Item;
  PIN: PIN;
  Notification: Notification;
}

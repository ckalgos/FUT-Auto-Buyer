import { UINotificationTypeEnum } from "../../enums/enums";
import { Observable } from "../observables/Observable.interface";

export interface Notification {
  queue([message, notificationType]: [
    string,
    UINotificationTypeEnum
  ]): Observable<unknown>;
  clearAll(): void;
}

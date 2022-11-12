import { UINotificationTypeEnum } from "../../types/enums/enums";
import { Notification } from "../../types/interfaces/autobuyer/Notification.interface";
import { UINotification } from "./UINotification";

interface NotificationDestination {
  ui: boolean;
  discord: boolean;
  discordWH: boolean;
  telegram: boolean;
  marketApp: boolean;
}

export class NotificationOrchestrator {
  private static __instance: NotificationOrchestrator;
  private instanceLookUp: Map<string, Notification>;
  private constructor() {
    this.instanceLookUp = new Map<string, Notification>();
    this.instanceLookUp.set("ui", new UINotification());
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new NotificationOrchestrator();
    }
    return this.__instance;
  }

  notify(
    message: string,
    destination: Partial<NotificationDestination>,
    notificationType: UINotificationTypeEnum = UINotificationTypeEnum.NEUTRAL
  ) {
    if (destination.ui) {
      this.instanceLookUp.get("ui")?.notify(message, notificationType);
    }
  }
}

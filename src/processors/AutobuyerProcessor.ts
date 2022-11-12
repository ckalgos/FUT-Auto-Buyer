import { Logger } from "../classes/Logger";
import { NotificationOrchestrator } from "../classes/notification/NotificationOrchestrator";
import { Timer } from "../classes/Timer";
import { AutoBuyerController } from "../controller/Autobuyer.controller";
import { TransferFactory } from "../factory/TransferFactory";
import { UINotificationTypeEnum } from "../types/enums/enums";
import { find } from "../utils/UI/dom/dom.util";

export class AutoBuyerProcessor {
  private static __instance: AutoBuyerProcessor;
  private __interval: Timer | null = null;
  private __controllerInstance: AutoBuyerController | null = null;
  private __isStarted: boolean;
  private __isOperationInProgress: boolean;
  private constructor() {
    this.__isStarted = false;
    this.__isOperationInProgress = false;
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new AutoBuyerProcessor();
    }
    return this.__instance;
  }

  setControllerInstance(instance: AutoBuyerController) {
    this.__controllerInstance = instance;
  }

  private async runActions() {
    const searchCriteria = this.__controllerInstance?._viewmodel.searchCriteria;
    if (!searchCriteria || this.__isOperationInProgress) {
      return;
    }
    services.Notification.clearAll();
    const orchestrator =
      TransferFactory.getInstance().getTransferOrchestrator();

    this.__isOperationInProgress = true;
    try {
      const results = await orchestrator.searchMarket(searchCriteria);
      if (results) {
        const purchasedItem = await orchestrator.handleTransferResults(results);
        if (purchasedItem) {
          await orchestrator.handleWonItem(purchasedItem);
        }
      }
    } catch (err) {
      Logger.writeToLog("Error occured");
    }
    this.__isOperationInProgress = false;
  }

  async start() {
    if (this.__isStarted) {
      return;
    }

    Logger.writeToLog("Autobuyer Started");
    NotificationOrchestrator.getInstance().notify(
      "Autobuyer Started",
      { ui: true },
      UINotificationTypeEnum.POSITIVE
    );
    const contentView = find(".ut-navigation-container-view--content");
    if (contentView) {
      contentView.scrollTop = contentView.scrollHeight;
    }
    this.__isStarted = true;
    this.__interval = new Timer(this.runActions.bind(this), 5, 10);
    this.__interval.run();
  }

  stop() {
    this.__interval?.stop();
    this.__isStarted = false;
    Logger.writeToLog("Autobuyer Stopped");
    NotificationOrchestrator.getInstance().notify(
      "Autobuyer Stopped",
      { ui: true },
      UINotificationTypeEnum.NEGATIVE
    );
  }

  pause() {}

  resume() {}
}

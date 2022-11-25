import { Logger } from "../classes/Logger";
import { NotificationOrchestrator } from "../classes/notification/NotificationOrchestrator";
import { Timer } from "../classes/Timer";
import { AutoBuyerController } from "../controller/Autobuyer.controller";
import { StatsFactory } from "../factory/StatsFactory";
import { TransferFactory } from "../factory/TransferFactory";
import { runStopHooks } from "../hooks/stop/runStopHooks";
import { UINotificationTypeEnum } from "../types/enums/enums";
import { find } from "../utils/UI/dom/dom.util";
import { StatsProcessor } from "./stats/StatsProcessor";

export class AutoBuyerProcessor {
  private static __instance: AutoBuyerProcessor;
  private interval: Timer | null = null;
  private controllerInstance: AutoBuyerController | null = null;
  private isStarted: boolean;
  private isOperationInProgress: boolean;
  private statsProcessor: StatsProcessor;

  private constructor() {
    this.isStarted = false;
    this.isOperationInProgress = false;
    this.statsProcessor = StatsFactory.getInstance().getProcessor();
  }

  static getInstance() {
    if (!this.__instance) {
      this.__instance = new AutoBuyerProcessor();
    }
    return this.__instance;
  }

  setControllerInstance(instance: AutoBuyerController) {
    this.controllerInstance = instance;
  }

  private async runActions() {
    const searchCriteria = this.controllerInstance?._viewmodel.searchCriteria;
    if (!searchCriteria || this.isOperationInProgress) {
      return;
    }
    services.Notification.clearAll();
    const message = runStopHooks();
    if (message) {
      Logger.writeToLog(message, UINotificationTypeEnum.NEGATIVE, true);
      this.stop();
      return;
    }

    const orchestrator =
      TransferFactory.getInstance().getTransferOrchestrator();

    this.isOperationInProgress = true;
    try {
      const results = await orchestrator.searchMarket(searchCriteria);
      if (results) {
        const purchasedItem = await orchestrator.handleTransferResults(results);
        if (purchasedItem) {
          await orchestrator.handleWonItem(purchasedItem);
        }
      }
    } catch (err) {
      Logger.writeToLog("Error occured", UINotificationTypeEnum.NEGATIVE, true);
    }
    this.isOperationInProgress = false;
  }

  async start() {
    if (this.isStarted) {
      return;
    }

    Logger.writeToLog(
      "Autobuyer Started",
      UINotificationTypeEnum.POSITIVE,
      true
    );
    const contentView = find(".ut-navigation-container-view--content");
    if (contentView) {
      contentView.scrollTop = contentView.scrollHeight;
    }
    this.isStarted = true;
    this.interval = new Timer(this.runActions.bind(this), 5, 10);
    this.interval.run();
    this.statsProcessor.start();
  }

  stop() {
    this.interval?.stop();
    this.statsProcessor.stop();
    this.isStarted = false;
    Logger.writeToLog(
      "Autobuyer Stopped",
      UINotificationTypeEnum.NEGATIVE,
      true
    );
  }

  pause() {}

  resume() {}
}

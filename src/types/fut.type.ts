import {
  EventTypeEnum,
  UINotificationTypeEnum,
  UTItemPile,
} from "./enums/enums";
import { UTApp } from "./interfaces/controllers/UTApp.interface";
import { UTGameFlowNavigationController } from "./interfaces/controllers/UTGameFlowNavigationController.interface";
import { UTGameTabBarController } from "./interfaces/controllers/UTGameTabBarController.interface";
import { UTMarketSearchFiltersViewController } from "./interfaces/controllers/UTMarketSearchFiltersViewController.interface";
import { Repositories } from "./interfaces/repositories/repositories.interface";
import { PINEventType } from "./interfaces/services/pinEvent.interface";
import { Services } from "./interfaces/services/services.interface";
import { UTCurrencyInputControl } from "./interfaces/uiControls/UTCurrentInputControl.interface";
import { UTNavigationButtonControl } from "./interfaces/uiControls/UTNavigationButtonControl.interface";
import { UTNumericInputSpinnerControl } from "./interfaces/uiControls/UTNumericInputSpinnerControl.interface";
import { UTStandardButtonControl } from "./interfaces/uiControls/UTStandardButtonControl.interface";
import { UTTextInputControl } from "./interfaces/uiControls/UTTextInputControl.interface";
import { UTToggleInputControl } from "./interfaces/uiControls/UTToggleInputControl.interface";
import { JSUtils } from "./interfaces/utils/jsUtils.interface";
import { EAFilterBarView } from "./interfaces/view/UTFilterBarView.interface";
import { UTNavigationBarView } from "./interfaces/view/UTNavigationBarView.interface";
import { UTTabBarItemView } from "./interfaces/view/UTTabBarItemView.interface";

declare global {
  function isPhone(): boolean;
  const UTMarketSearchFiltersViewController: UTMarketSearchFiltersViewController;
  const UTGameTabBarController: UTGameTabBarController;
  const UTGameFlowNavigationController: UTGameFlowNavigationController;

  const UTStandardButtonControl: UTStandardButtonControl;
  const UTNumericInputSpinnerControl: UTNumericInputSpinnerControl;
  const UTTextInputControl: UTTextInputControl;
  const UTToggleCellView: UTToggleInputControl;
  const UTCurrencyInputControl: UTCurrencyInputControl;
  const UTNavigationButtonControl: UTNavigationButtonControl;

  const EAFilterBarView: EAFilterBarView;
  const UTTabBarItemView: UTTabBarItemView;
  const UTNavigationBarView: UTNavigationBarView;

  const services: Services;
  const repositories: Repositories;

  const JSUtils: JSUtils;

  const EventType: typeof EventTypeEnum;
  const ItemPile: typeof UTItemPile;
  const UINotificationType: typeof UINotificationTypeEnum;

  const PIN_PAGEVIEW_EVT_TYPE: unknown;
  const PINEventType: PINEventType;

  const AUCTION_MIN_BID: number;
  const AUCTION_MIN_BUY: number;
  const AUCTION_MAX_BID: number;

  const getAppMain: () => UTApp;

  interface Window {
    ReactNativeWebView: {
      postMessage(message: string): void;
    };
  }
}

export {};

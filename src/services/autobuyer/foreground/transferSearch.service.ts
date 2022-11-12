import { UTSearchCriteria } from "../../../types/interfaces/search/UTSearchCriteria.interface";

import { runSearchHooks } from "../../../hooks/search/runSearchHooks";
import { tap, tapElement } from "../../../utils/UI/dom/events.util";

import { getCurrentController } from "../../../utils/UI/EA/getCurrentController";
import {
  isMarketSearchFilterViewController,
  isMarketSearchResultSplitViewController,
  isMarketSearchResultViewController,
} from "../../../typeGuard/EA/controller.typeGuard";
import {
  find,
  findByText,
  waitForElement,
} from "../../../utils/UI/dom/dom.util";
import { NotificationOrchestrator } from "../../../classes/notification/NotificationOrchestrator";
import { UINotificationTypeEnum } from "../../../types/enums/enums";
import { wait } from "../../../utils/commonUtil";

export const searchMarketFG = async (searchCriteria: UTSearchCriteria) => {
  const errorMessage = runSearchHooks(searchCriteria);
  if (errorMessage) {
    NotificationOrchestrator.getInstance().notify(
      errorMessage,
      { ui: true },
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }

  const itemDetailsBackElement = findByText(
    ".ut-navigation-bar-view",
    services.Localization!.localize("navbar.label.detailView")
  );

  if (itemDetailsBackElement) {
    const backButton = find(
      ".ut-navigation-button-control:not(.menu-btn)",
      itemDetailsBackElement
    );
    backButton && tapElement(backButton);
    await wait(0.3);
  }

  const resultBackElement = findByText(
    ".ut-navigation-bar-view",
    services.Localization!.localize("navbar.label.searchresults")
  );

  if (resultBackElement) {
    const backButton = find(
      ".ut-navigation-button-control:not(.menu-btn)",
      resultBackElement
    );
    backButton && tapElement(backButton);
    await wait(0.3);
  } else {
    tap(".icon-transfer");
    await wait(0.5);
    tap(".ut-tile-transfer-market");
    await wait(0.3);
  }

  const currentController = getCurrentController();
  if (isMarketSearchFilterViewController(currentController)) {
    Object.assign(currentController._viewmodel.searchCriteria, searchCriteria);
    currentController.viewDidAppear();
    tap(".call-to-action");
    await waitForElement(".SearchResults");
    const currentResultController = getCurrentController();
    if (isMarketSearchResultSplitViewController(currentResultController)) {
      return currentResultController._leftController._paginationViewModel.getCurrentPageItems();
    } else if (isMarketSearchResultViewController(currentResultController)) {
      return currentResultController._paginationViewModel.getCurrentPageItems();
    }
  }
};

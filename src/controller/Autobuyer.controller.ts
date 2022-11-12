import { Logger } from "../classes/Logger";
import { MenuItem } from "../classes/MenuItem";
import { AutoBuyerProcessor } from "../processors/AutobuyerProcessor";
import { append, find } from "../utils/UI/dom/dom.util";
import { createButton } from "../utils/UI/EA/createButton";
import { logView } from "../views/LogView";

export class AutoBuyerController extends UTMarketSearchFiltersViewController {
  init() {
    super.init();
    const view = this.getView();
    const viewRoot = view.getRootElement();
    if (!isPhone()) viewRoot.setAttribute("style", "width: 52%; float: left;");
    viewRoot.id = "autobuyer";

    const autoBuyerInstance = AutoBuyerProcessor.getInstance();
    autoBuyerInstance.setControllerInstance(this);

    const createButtonWithContext = createButton.bind(this);

    const stopBtn = createButtonWithContext("Stop", () => {
      autoBuyerInstance.stop();
    });
    const searchBtn = createButtonWithContext(
      "Start",
      async () => {
        autoBuyerInstance.start();
      },
      "call-to-action"
    );

    const btnContainer = find(".button-container", viewRoot);
    if (!btnContainer) {
      return;
    }
    find(".call-to-action", btnContainer)?.remove();

    append(btnContainer, searchBtn.getRootElement());
    append(btnContainer, stopBtn.getRootElement());

    if (!isPhone()) {
      const clearLogBtn = createButtonWithContext("Clear Log", () =>
        Logger.clear()
      );
      append(btnContainer, clearLogBtn.getRootElement());
    }

    const menuItem = new MenuItem();
    find(".search-prices", viewRoot)?.append(menuItem.getView());
  }

  viewDidAppear() {
    this.getNavigationController().setNavigationVisibility(true, true);
    super.viewDidAppear();
  }

  getNavigationTitle() {
    setTimeout(() => {
      const title = find(".title");
      title?.classList.add("autobuyer-title");

      const rootElement = this.getParentViewController()
        .getView()
        .getRootElement();
      const navigationContent = find(
        ".ut-navigation-container-view--content",
        rootElement
      );
      navigationContent && append(navigationContent, logView());
    });
    return "autoBuyer";
  }
}

JSUtils.inherits(AutoBuyerController, UTMarketSearchFiltersViewController);

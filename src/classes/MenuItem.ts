import { find } from "../utils/UI/dom/dom.util";
import { BuySettingView } from "../views/settings/BuySettingView";
import { SearchSettingView } from "../views/settings/SearchSettingView";
import { SellSettingView } from "../views/settings/SellSettingView";

export class MenuItem {
  filterBarView: typeof EAFilterBarView;

  viewLookUp: Map<number, Function>;

  constructor() {
    this.filterBarView = new EAFilterBarView();
    this.filterBarView.addTab(0, "Buy/Bid Settings");
    this.filterBarView.addTab(1, "Sell Settings");
    this.filterBarView.addTab(2, "Search Settings");
    this.filterBarView.setActiveTab(0);
    this.filterBarView.layoutSubviews();

    this.filterBarView.addTarget(this, this.onSettingChange, EventType.TAP);

    const rootElement = this.filterBarView.getRootElement();
    rootElement.id = "futmenuitem";
    rootElement.setAttribute("style", "margin-top: 20px;");

    rootElement.append(BuySettingView());

    const menuContainer = find(".menu-container", rootElement);
    if (menuContainer) {
      menuContainer.style.overflowX = "auto";
    }

    this.viewLookUp = new Map();
    this.viewLookUp.set(0, BuySettingView);
    this.viewLookUp.set(1, SellSettingView);
    this.viewLookUp.set(2, SearchSettingView);
  }

  getView() {
    return this.filterBarView.getRootElement();
  }

  private onSettingChange(
    _: unknown,
    __: unknown,
    { index }: { index: number }
  ) {
    const rootElement = this.filterBarView.getRootElement();
    find(".buyer-settings-wrapper", rootElement)?.remove();

    const view = this.viewLookUp.get(index);
    view && rootElement.append(view());
  }
}

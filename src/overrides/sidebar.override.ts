import { AutoBuyerController } from "../controller/Autobuyer.controller";
import { UTGameFlowNavigationController } from "../types/interfaces/controllers/UTGameFlowNavigationController.interface";

export const sideBarOverride = () => {
  const navViewInit = UTGameTabBarController.prototype.initWithViewControllers;
  UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
    const autoBuyerNav = new UTGameFlowNavigationController();
    autoBuyerNav.initWithRootController(new AutoBuyerController());
    autoBuyerNav.tabBarItem = generateAutoBuyerTab("Autobuyer");
    tabs = getApplicableTabs(tabs);
    tabs.push(autoBuyerNav);
    navViewInit.call(this, tabs);
  };
};

const getApplicableTabs = (tabs: UTGameFlowNavigationController[]) => {
  if (!isPhone()) {
    return tabs;
  }

  const updatedTabs = [];
  updatedTabs.push(tabs[0]);
  updatedTabs.push(tabs[2]);
  updatedTabs.push(tabs[3]);
  updatedTabs.push(tabs[4]);

  return updatedTabs;
};

const generateAutoBuyerTab = (title: string) => {
  const autoBuyerTab = new UTTabBarItemView();
  autoBuyerTab.init();
  autoBuyerTab.setTag(8);
  autoBuyerTab.setText(title);
  autoBuyerTab.addClass("icon-transfer");
  return autoBuyerTab;
};

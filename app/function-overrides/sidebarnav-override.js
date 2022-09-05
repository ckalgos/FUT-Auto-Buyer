import { AutoBuyerViewController } from "../views/AutoBuyerViewController";

export const sideBarNavOverride = () => {
  const navViewInit = UTGameTabBarController.prototype.initWithViewControllers;
  UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
    const autoBuyerNav = new UTGameFlowNavigationController();
    autoBuyerNav.initWithRootController(new AutoBuyerViewController());
    autoBuyerNav.tabBarItem = generateAutoBuyerTab("Autobuyer");
    tabs = getApplicableTabs(tabs);
    tabs.push(autoBuyerNav);
    navViewInit.call(this, tabs);
  };
};

const getApplicableTabs = (tabs) => {
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

const generateAutoBuyerTab = (title) => {
  const autoBuyerTab = new UTTabBarItemView();
  autoBuyerTab.init();
  autoBuyerTab.setTag(8);
  autoBuyerTab.setText(title);
  autoBuyerTab.addClass("icon-transfer");
  return autoBuyerTab;
};

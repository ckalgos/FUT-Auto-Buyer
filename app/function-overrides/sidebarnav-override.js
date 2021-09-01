import { AutoBuyerViewController } from "../views/AutoBuyerViewController";

export const sideBarNavOverride = () => {
  const navViewInit = UTGameTabBarController.prototype.initWithViewControllers;
  UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
    const autoBuyerNav = new UTGameFlowNavigationController();
    autoBuyerNav.initWithRootController(new AutoBuyerViewController());
    autoBuyerNav.tabBarItem = generateAutoBuyerTab();
    tabs.push(autoBuyerNav);
    navViewInit.call(this, tabs);
  };
};

const generateAutoBuyerTab = () => {
  const autoBuyerTab = new UTTabBarItemView();
  autoBuyerTab.init();
  autoBuyerTab.setTag(8);
  autoBuyerTab.setText("AutoBuyer");
  autoBuyerTab.addClass("icon-transfer");
  return autoBuyerTab;
};

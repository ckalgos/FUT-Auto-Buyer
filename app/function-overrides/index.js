import { networkLogs } from "./network-override";
import { sideBarNavOverride } from "./sidebarnav-override";
import { topNavOverride } from "./topnav-override";

export const initOverrides = () => {
  sideBarNavOverride();
  networkLogs();
  isPhone() && topNavOverride();
};

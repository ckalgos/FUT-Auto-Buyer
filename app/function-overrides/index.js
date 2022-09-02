import { networkLogs } from "./network-override";
import { sideBarNavOverride } from "./sidebarnav-override";

export const initOverrides = () => {
  sideBarNavOverride();
  networkLogs();
};

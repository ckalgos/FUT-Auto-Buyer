import { initDatabase } from "../utils/dbUtil";
import { xmlRequestOverride } from "./NetworkIntercepts";
import { sideBarNavOverride } from "./sidebarnav-override";
import { topNavOverride } from "./topnav-override";

import "./network-override";
import { currencyTapOverride } from "./currencyTap-override";

export const initOverrides = () => {
  initDatabase();
  sideBarNavOverride();
  isPhone() && topNavOverride();
  xmlRequestOverride();
  currencyTapOverride();
};

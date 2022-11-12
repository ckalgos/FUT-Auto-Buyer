import { sideBarOverride } from "./sidebar.override";
import { styleOverride } from "./style.override";
import { topNavBarOverride } from "./topnavbarOverride";

export const initializeOverrides = () => {
  sideBarOverride();
  styleOverride();
  isPhone() && topNavBarOverride();
};

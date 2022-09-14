import { STATE_ACTIVE } from "../app.constants";
import { setValue } from "../services/repository";
import { pauseBotIfRequired, switchFilterIfRequired } from "./autoActionsUtil";
import { sendUINotification } from "./notificationUtil";
import { searchTransferMarket } from "./searchUtil";
import { transferListUtil } from "./transferlistUtil";
import { watchListUtil } from "./watchlistUtil";

export const setInitialValues = (isResume) => {
  sendUINotification(isResume ? "Autobuyer Resumed" : "Autobuyer Started");
  setValue("autoBuyerActive", true);
  setValue("autoBuyerState", STATE_ACTIVE);
  isPhone() && $(".ut-tab-bar-item").attr("disabled", true);
  if (!isResume) {
    setValue("botStartTime", new Date());
    setValue("purchasedCardCount", 0);
    setValue("searchFailedCount", 0);
    setValue("currentPage", 1);
  }
};

export const getFunctionsWithContext = function () {
  return {
    switchFilterWithContext: switchFilterIfRequired.bind(this),
    srchTmWithContext: searchTransferMarket.bind(this),
    watchListWithContext: watchListUtil.bind(this),
    transferListWithContext: transferListUtil.bind(this),
    pauseBotWithContext: pauseBotIfRequired.bind(this),
  };
};

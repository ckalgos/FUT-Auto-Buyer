import { resetProfit } from "../utils/statsUtil";
import { updateUserCredits } from "../utils/userUtil";

export const currencyTapOverride = () => {
  const currentTap = UTCurrencyNavigationBarView.prototype._tapDetected;
  UTCurrencyNavigationBarView.prototype._tapDetected = function (e) {
    const res = currentTap.call(this, e);
    const isCoins = e.target.classList.contains("coins");
    if (isCoins) {
      updateUserCredits();
      return res;
    }
    const isProfit = e.target.classList.contains("profit");
    isProfit && resetProfit();
    return res;
  };
};

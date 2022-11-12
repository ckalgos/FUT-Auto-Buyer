export const roundOffPrice = (price: number, minVal = 0) => {
  let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
    return price >= e.min;
  });
  var nearestPrice = Math.round(price / range.inc) * range.inc;
  return Math.max(Math.min(nearestPrice, 14999000), minVal);
};

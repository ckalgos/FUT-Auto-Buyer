export const roundOffPrice = (price) => {
  let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
    return price >= e.min;
  });
  var nearestPrice = Math.round(price / range.inc) * range.inc;
  return Math.max(Math.min(nearestPrice, 14999000), 0);
};

export const getSellBidPrice = (bin) => {
  if (bin <= 1000) {
    return bin - 50;
  }

  if (bin > 1000 && bin <= 10000) {
    return bin - 100;
  }

  if (bin > 10000 && bin <= 50000) {
    return bin - 250;
  }

  if (bin > 50000 && bin <= 100000) {
    return bin - 500;
  }

  return bin - 1000;
};

export const getBuyBidPrice = (bin) => {
  if (bin < 1000) {
    return bin + 50;
  }

  if (bin >= 1000 && bin < 10000) {
    return bin + 100;
  }

  if (bin >= 10000 && bin < 50000) {
    return bin + 250;
  }

  if (bin >= 50000 && bin < 100000) {
    return bin + 500;
  }

  return bin + 1000;
};

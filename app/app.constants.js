export const MAX_CLUB_SEARCH = 90;
export const MAX_MARKET_SEARCH = 20;

export const STATE_ACTIVE = "Active";
export const STATE_PAUSED = "Paused";
export const STATE_STOPPED = "Stopped";

export const errorCodeLookUp = {
  521: "Request Rejected",
  512: "Request Rejected",
  429: "Too many request from this user",
  426: "Other user won the (card / bid)",
  461: "Other user won the (card / bid)",
};

export const defaultBuyerSetting = {
  idBuyFutBinPercent: 95,
  idAbCardCount: 1000,
  idAbCardCountisDefaultValue: true,
  idAbItemExpiring: "1H",
  idAbItemExpiringisDefaultValue: true,
  idAbSearchResult: 21,
  idAbSearchResultisDefaultValue: true,
  idSellFutBinPercent: "105-110",
  idFutBinDuration: "1H",
  idFutBinDurationisDefaultValue: true,
  idAbMinDeleteCount: 10,
  idSellRatingThreshold: 100,
  idSellRatingThresholdisDefaultValue: true,
  idAbMinRating: 10,
  idAbMinRatingisDefaultValue: true,
  idAbMaxRating: 100,
  idAbMaxRatingisDefaultValue: true,
  idAbMaxSearchPage: 5,
  idAbMaxSearchPageisDefaultValue: true,
  idAbRandMinBidInput: 300,
  idAbRandMinBidInputisDefaultValue: true,
  idAbRandMinBuyInput: 300,
  idAbRandMinBuyInputisDefaultValue: true,
  idBuyFutBinPrice: true,
  idSellFutBinPrice: true,
  idSellCheckBuyPrice: true,
  idAbSellToggle: false,
  idAbRandMinBidToggle: true,
};

export const defaultCommonSetting = {
  idAbAddBuyDelay: true,
  idAbCycleAmount: "15-20",
  idAbDelayToAdd: "3S",
  idAbMaxPurchases: 1,
  idAbNumberFilterSearch: 3,
  idAbNumberFilterSearchisDefaultValue: true,
  idAbPauseFor: "15-30S",
  idAbSoundToggle: true,
  idAbSoundVolume: 100,
  idAbStopAfter: "1-2H",
  idAbStopErrorCodeCount: 3,
  idAbWaitTime: "5-8",
  idAbWaitTimeisDefaultValue: false,
  idAutoClearExpired: true,
  idAutoClearLog: false,
  idShowLogReverse: true,
};

export const isMarketAlertApp = !!window.ReactNativeWebView;

export interface UTCurrencyInputControl {
  PRICE_TIERS: {
    min: number;
    inc: number;
  }[];
  getIncrementBelowVal(value: number): number;
  getIncrementAboveVal(value: number): number;
}

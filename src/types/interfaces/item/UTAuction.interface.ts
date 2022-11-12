export interface UTAuctionEntity {
  buyNowPrice: number;
  currentBid: number;
  expires: number;
  isUpdating: boolean;
  stale: boolean;
  startingBid: number;
  timestamp: number;
  tradeId: number;
  tradeOwner: boolean;
  _bidState: string;
  _tradeState: string;
  _watched: boolean;

  isExpired(): boolean;
}

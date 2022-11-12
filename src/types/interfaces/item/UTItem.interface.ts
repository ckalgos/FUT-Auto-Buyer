import { UTAuctionEntity } from "./UTAuction.interface";
import { UTStaticDataEntity } from "./UTStaticData.interface";

interface PriceRange {
  minimum: number;
  maximum: number;
}

export interface UTItem {
  amount: number;
  authenticity: boolean;
  ballRestricted: boolean;
  bannerRestricted: boolean;
  concept: boolean;
  continuationId: string;
  contract: number;
  definitionId: number;
  discardDate: number;
  discardValue: number;
  discardable: boolean;
  duplicateId: number;
  duplicateItemLoans: number;
  hasLevels: boolean;
  iconId: number;
  id: number;
  injuryGames: number;
  injuryType: string;
  lastSalePrice: number;
  leagueId: number;
  loans: number;
  loyaltyBonus: number;
  nationId: number;
  owners: number;
  pile: number;
  playStyle: number;
  preferredPosition: number;
  rareflag: number;
  rating: number;
  stackCount: number;
  state: string;
  subtype: number;
  teamId: number;
  tifoRestricted: boolean;
  timestamp: number;
  type: string;
  untradeable: boolean;
  untradeableCount: number;
  _assetId: number;
  _attributes: number[];
  _auction: UTAuctionEntity;
  _defensiveWorkRate: number;
  _itemPriceLimits: PriceRange;
  _lifetimeStats: number[];
  _offensiveWorkRate: number;
  _preferredFoot: number;
  _skillMoves: number;
  _stats: number[];
  _weakFoot: number;
  _staticData: UTStaticDataEntity;

  isStyleModifier(): boolean;
  isPlayerContract(): boolean;
  isManagerContract(): boolean;
  isPlayerPositionModifier(): boolean;
  isMiscItem(): boolean;
  isDuplicate(): boolean;
  isGoldRating(): boolean;
  isSilverRating(): boolean;
  isBronzeRating(): boolean;
  isSpecial(): boolean;
  isPlayer(): boolean;
  hasPriceLimits(): boolean;
  isTraining(): boolean;
  getAuctionData(): UTAuctionEntity;
  getStaticData(): UTStaticDataEntity;
}

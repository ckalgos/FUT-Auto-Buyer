enum Level {
  gold = "gold",
  silver = "silver",
  bronze = "bronze",
  special = "special",
  any = "any",
}

enum Type {
  player = "player",
  staff = "staff",
  clubItem = "clubItem",
  training = "training",
}

export interface UTSearchCriteria {
  club: number;
  count: number;
  defId: number[];
  excludeDefIds: number[];
  isExactSearch: boolean;
  league: number;
  level: Level;
  maskedDefId: number;
  maxBid: number;
  maxBuy: number;
  minBid: number;
  minBuy: number;
  nation: number;
  offset: number;
  playStyle: number;
  rarities: number[];
  sortBy: string;
  acquiredDate: string;
  _category: string;
  _position: string;
  _sort: string;
  _type: Type;
  _untradeables: string;
  _zone: number;

  category: string;
  className: string;
  position: string;
  sort: string;
  type: string;
  untradeables: string;
  zone: number;
  hasValidDefId: boolean;
  isModified: boolean;
  reset: void;
  resetDefId: void;
  update: void;
}

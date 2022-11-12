import { UTItemPile } from "../../enums/enums";
import { UTItem } from "../item/UTItem.interface";
import { EAObservable, Observable } from "../observables/Observable.interface";
import { UTSearchCriteria } from "../search/UTSearchCriteria.interface";
import { SearchResult } from "../search/UTSearchResult.interface";

interface MarketRepository {
  isCacheExpired(): boolean;
}

export interface Item {
  marketRepository: MarketRepository;
  clearTransferMarketCache(): void;
  searchTransferMarket(
    criteria: UTSearchCriteria,
    page: number
  ): Observable<SearchResult>;
  bid(entity: UTItem, coins: number): Observable<number[]>;
  requestMarketData(card: UTItem): Observable<number[]>;
  list(
    entity: UTItem,
    startPrice: number,
    binPrice: number,
    duration: number
  ): Observable<number[]>;
  move(entities: UTItem[] | UTItem, pile: UTItemPile): EAObservable;
  redeem(credit: UTItem): EAObservable;
  discard(entities: UTItem[]): EAObservable;
  requestUnassignedItems(): Observable<{ items: UTItem[] }>;
}

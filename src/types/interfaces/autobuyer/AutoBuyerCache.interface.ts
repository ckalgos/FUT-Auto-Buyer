import { UTItem } from "../item/UTItem.interface";

export interface AutobuyerCache {
  sellQueue?: UTItem[];
  cachedBids?: Set<number>;
}

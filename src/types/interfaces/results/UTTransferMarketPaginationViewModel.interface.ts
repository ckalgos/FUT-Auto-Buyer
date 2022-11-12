import { UTItem } from "../item/UTItem.interface";

export interface UTTransferMarketPaginationViewModel {
  getCurrentPageItems(): UTItem[];
}

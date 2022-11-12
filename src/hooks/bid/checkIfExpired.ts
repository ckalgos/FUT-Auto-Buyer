import { UTItem } from "../../types/interfaces/item/UTItem.interface";

export const checkIfExpired = (item: UTItem) => {
  if (item.getAuctionData().isExpired()) {
    return "Auction Expired";
  }
  return null;
};

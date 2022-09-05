export const sortPlayers = (playerList, sortBy, sortOrder) => {
  let sortFunc = (a) => a._auction.buyNowPrice;
  if (sortBy === "bid") {
    sortFunc = (a) => a._auction.currentBid || a._auction.startingBid;
  } else if (sortBy === "rating") {
    sortFunc = (a) => parseInt(a.rating);
  } else if (sortBy === "expires") {
    sortFunc = (a) => parseInt(a._auction.expires);
  }
  playerList.sort((a, b) => {
    const sortAValue = sortFunc(a);
    const sortBValue = sortFunc(b);
    return !sortOrder ? sortBValue - sortAValue : sortAValue - sortBValue;
  });
  return playerList;
};

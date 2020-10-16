
// ==UserScript==
// @name         FUT 21 Autobuyer with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      0.6
// @updateURL    https://github.com/chithakumar13/Fifa-AutoBuyer/blob/master/autobuyer.js
// @description  FUT Snipping Tool
// @author       CK Algos
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    window.getMaxSearchBid = function (min, max) {
        return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
    };

    window.searchCount = 0;

    window.errorCodeLookUp = {
        '521': 'Server Rejected the request',
        '512': 'Server Rejected the request',
        '429': 'Bidding Rejected, too many request received from this user',
        '426': 'Bidding Rejected, other user won the (card / bid)',
        '461': 'Bidding Rejected, other user won the (card / bid)',
    }

    window.initStatisics = function () {
        window.futStatistics = {
            soldItems: '-',
            unsoldItems: '-',
            activeTransfers: '-',
            availableItems: '-',
            coins: '-',
            coinsNumber: 0
        };

        window.timers = {
            search: window.createTimeout(0, 0),
            coins: window.createTimeout(0, 0),
            transferList: window.createTimeout(0, 0),
            bidCheck: window.createTimeout(0, 0),
        };
    };

    window.bids = [];
    window.sellBids = [];

    window.createTimeout = function (time, interval) {
        return {
            start: time,
            finish: time + interval,
        };
    };

    window.processor = window.setInterval(function () {
        if (window.autoBuyerActive) {

            window.stopIfRequired();

            var time = (new Date()).getTime();

            if (window.timers.search.finish == 0 || window.timers.search.finish <= time) {

                let searchRequest = 1;

                if ($('#ab_con_request').val() !== '') {
                    searchRequest = $('#ab_con_request').val();
                }

                while (searchRequest-- > 0) {
                    window.searchFutMarket(null, null, null);
                }

                window.timers.search = window.createTimeout(time, window.getRandomWait());
            }

            if (window.timers.coins.finish == 0 || window.timers.coins.finish <= time) {
                window.futStatistics.coins = services.User.getUser().coins.amount.toLocaleString();
                window.futStatistics.coinsNumber = services.User.getUser().coins.amount;
                window.timers.coins = window.createTimeout(time, 2500);
            }

            if (window.timers.transferList.finish == 0 || window.timers.transferList.finish <= time) {
                window.updateTransferList();

                window.timers.transferList = window.createTimeout(time, 30000);
            }

            if (window.timers.bidCheck.finish == 0 || window.timers.bidCheck.finish <= time) {
                window.watchBidItems();

                window.timers.bidCheck = window.createTimeout(time, 1000);
            }
        } else {
            window.initStatisics();
        }

        window.updateStatistics();
    }, 500);

    window.stopIfRequired = function () {
        var stopAfter = "1H";
        if ($('#ab_stop_after').val()) {
            stopAfter = $('#ab_stop_after').val();
        }
        let interval = stopAfter[stopAfter.length - 1].toUpperCase();
        let time = parseInt(stopAfter.substring(0, stopAfter.length - 1));

        let multipler = (interval === "M") ? 60 : ((interval === "H") ? 3600 : 1)
        if (time) {
            time = time * multipler;

            let currentTime = new Date();

            let timeElapsed = (currentTime.getTime() - window.botStartTime.getTime()) / 1000;

            if (timeElapsed >= time) {
                window.deactivateAutoBuyer();
            }
        }
    }

    window.searchFutMarket = function (sender, event, data) {
        if (!window.autoBuyerActive) {
            return;
        }

        var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;
         
        services.Item.clearTransferMarketCache();

        services.Item.searchTransferMarket(searchCriteria, 1).observe(this, (function (sender, response) {
            if (response.success && window.autoBuyerActive) {
                writeToDebugLog('Received ' + response.data.items.length + ' items');

                var maxPurchases = 3;
                if ($('#ab_max_purchases').val() !== '') {
                    maxPurchases = Math.max(1, parseInt($('#ab_max_purchases').val()));
                }

                response.data.items.sort(function (a, b) {
                    var priceDiff = a._auction.buyNowPrice - b._auction.buyNowPrice;

                    if (priceDiff != 0) {
                        return priceDiff;
                    }

                    return a._auction.expires - b._auction.expires;
                });

                for (var i = 0; i < response.data.items.length; i++) {
                    let player = response.data.items[i];
                    let auction = player._auction;

                    let buyNowPrice = auction.buyNowPrice;
                    let currentBid = auction.currentBid || auction.startingBid;
                    let isBid = auction.currentBid;
                    let bidPrice = parseInt(jQuery('#ab_max_bid_price').val());

                    let expires = services.Localization.localizeAuctionTimeRemaining(auction.expires);
                    writeToDebugLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + auction.tradeId + '] [' + expires + '] ' + buyNowPrice);


                    if (buyNowPrice <= parseInt(jQuery('#ab_buy_price').val()) && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {
                        writeToDebugLog('Buy Price :' + jQuery('#ab_buy_price').val());
                        buyPlayer(player, buyNowPrice, true);

                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    } else if (bidPrice && currentBid <= ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice) && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {

                        writeToDebugLog('Bid Price :' + bidPrice);
                        buyPlayer(player, ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid));
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    }
                };
            }
        }));
    }

    window.watchBidItems = function () {
        services.Item.requestWatchedItems().observe(this, function (t, response) {

            var bidPrice = parseInt(jQuery('#ab_max_bid_price').val());
            var sellPrice = parseInt(jQuery('#ab_sell_price').val());

            if (bidPrice) {
                let outBidItems = response.data.items.filter(function (item) {
                    return item.getAuctionData().isOutbid() && !item.getAuctionData().isExpired();
                });

                for (var i = 0; i < outBidItems.length; i++) {

                    let player = outBidItems[i];
                    let auction = player._auction;

                    let isBid = auction.currentBid;

                    let currentBid = auction.currentBid || auction.startingBid;

                    let priceToBid = (isBid) ? window.getSellBidPrice(bidPrice) : bidPrice;

                    let checkPrice = (isBid) ? window.getBuyBidPrice(currentBid) : currentBid;

                    if (currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber) {
                        writeToDebugLog('Bidding on outbidded item -> Bidding Price :' + checkPrice);
                        buyPlayer(player, checkPrice);
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    }
                }
            }

            if (sellPrice && !isNaN(sellPrice)) {

                let boughtItems = response.data.items.filter(function (item) {
                    return item.getAuctionData().isWon() && !window.sellBids.includes(item._auction.tradeId);
                });

                for (var i = 0; i < boughtItems.length; i++) {
                    let player = boughtItems[i];
                    let auction = player._auction;

                    window.sellBids.push(auction.tradeId);

                    writeToLog(player._staticData.firstName + ' ' + player._staticData.lastName + '[' + player._auction.tradeId + '] -- Selling for: ' + sellPrice);

                    player.clearAuction();

                    window.sellRequestTimeout = window.setTimeout(function () {
                        services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                    }, window.getRandomWait());
                }

                services.Item.clearTransferMarketCache();
            }
        });
    }

    window.buyPlayer = function (player, price, isBin) {
        services.Item.bid(player, price).observe(this, (function (sender, data) {
            if (data.success) {
                writeToLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + player._auction.tradeId + '] ' + price + ((isBin) ? ' bought' : ' bid successfully'));
                var sellPrice = parseInt(jQuery('#ab_sell_price').val());
                if (isBin && sellPrice !== 0 && !isNaN(sellPrice)) {
                    writeToLog(' -- Selling for: ' + sellPrice);
                    window.sellRequestTimeout = window.setTimeout(function () {
                        services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                    }, window.getRandomWait());
                }
            } else {
                writeToLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + player._auction.tradeId + '] ' + price + ((isBin) ? ' buy failed' : ' bid failed') + '\nError Code : ' + data.status + '-' + (errorCodeLookUp[data.status] || ''));
            }
        }));
    }

    window.getSellBidPrice = function (bin) {
        if (bin <= 1000) {
            return bin - 50;
        }

        if (bin > 1000 && bin <= 10000) {
            return bin - 100;
        }

        if (bin > 10000 && bin <= 50000) {
            return bin - 250;
        }

        if (bin > 50000 && bin <= 100000) {
            return bin - 500;
        }

        return bin - 1000;
    };

    window.getBuyBidPrice = function (bin) {
        if (bin < 1000) {
            return bin + 50;
        }

        if (bin >= 1000 && bin < 10000) {
            return bin + 100;
        }

        if (bin >= 10000 && bin < 50000) {
            return bin + 250;
        }

        if (bin >= 50000 && bin < 100000) {
            return bin + 500;
        }

        return bin + 1000;
    };

    window.updateTransferList = function () {
        services.Item.requestTransferItems().observe(this, function (t, response) {
            let soldItems = response.data.items.filter(function (item) {
                return item.getAuctionData().isSold();
            });

            window.futStatistics.soldItems = soldItems.length;
            window.futStatistics.unsoldItems = response.data.items.filter(function (item) {
                return !item.getAuctionData().isSold() && item.getAuctionData().isExpired();
            }).length;

            window.futStatistics.activeTransfers = response.data.items.filter(function (item) {
                return item.getAuctionData().isSelling();
            }).length;

            window.futStatistics.availableItems = response.data.items.filter(function (item) {
                return item.getAuctionData().isInactive();
            }).length;

            var minSoldCount = 10;
            if ($('#ab_min_delete_count').val() !== '') {
                minSoldCount = Math.max(1, parseInt($('#ab_min_delete_count').val()));
            }

            if (window.futStatistics.soldItems >= minSoldCount) {
                writeToLog(window.futStatistics.soldItems + " item(s) sold");
                window.clearSoldItems();
            }
        });
    }

    window.clearSoldItems = function () {
        services.Item.clearSoldItems().observe(this, function (t, response) { });
    }
})();

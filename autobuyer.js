
// ==UserScript==
// @name         FUT 21 Autobuyer with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      0.9
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
            bidCheck: window.createTimeout(0, 0)
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

            window.pauseIfRequired();

            var time = (new Date()).getTime();

            if (window.timers.search.finish == 0 || window.timers.search.finish <= time) {

                let searchRequest = 1; 

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

                window.timers.bidCheck = window.createTimeout(time, 20000);
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
                window.deactivateAutoBuyer(true);
            }
        }

        if (window.buyCardCount && window.purchasedCardCount >= window.buyCardCount) {
            window.deactivateAutoBuyer(true);
        }
    }

    window.pauseIfRequired = function () {
        if (window.searchCountBeforePause <= 0) {
            var pauseFor = "0S";
            if ($('#ab_pause_for').val()) {
                pauseFor = $('#ab_pause_for').val();
            }
            let interval = pauseFor[pauseFor.length - 1].toUpperCase();
            let time = parseInt(pauseFor.substring(0, pauseFor.length - 1));

            let multipler = (interval === "M") ? 60 : ((interval === "H") ? 3600 : 1)
            if (time) {
                time = time * multipler * 1000;

                window.deactivateAutoBuyer();

                setTimeout(() => {
                    window.activateAutoBuyer(false);
                }, time);
            } else {
                window.searchCountBeforePause = window.defaultStopTime;
            }
        }
    }

    window.searchFutMarket = function (sender, event, data) {
        if (!window.autoBuyerActive) {
            return;
        }

        var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;

        if (window.bidIncreaseCount >= 8) { //increase bid 8 times before reseting
            window.prevMinBid = 100;
        }

        let currentMinBid = (window.prevMinBid === 100 && searchCriteria.minBid) ? searchCriteria.minBid : window.prevMinBid;

        window.prevMinBid = getBuyBidPrice(currentMinBid);

        searchCriteria.minBid = window.prevMinBid;
        window.bidIncreaseCount++;

        services.Item.clearTransferMarketCache();

        var expiresIn = 3600;
        if ($('#ab_item_expiring').val() !== '') {
            var expiresInString = "1H";
            if ($('#ab_item_expiring').val()) {
                expiresInString = $('#ab_item_expiring').val();
            }
            let expiresInterval = expiresInString[expiresInString.length - 1].toUpperCase();
            let expiresInTime = parseInt(expiresInString.substring(0, expiresInString.length - 1));

            let multipler = (expiresInterval === "M") ? 60 : ((expiresInterval === "H") ? 3600 : 1)
            if (expiresInTime) {
                expiresIn = expiresInTime * multipler;
            }
        }

        if ($('#ab_card_count').val() !== '') {
            window.buyCardCount = parseInt(jQuery('#ab_card_count').val());
        } else {
            window.buyCardCount  = undefined;
        }

        services.Item.searchTransferMarket(searchCriteria, window.currentPage).observe(this, (function (sender, response) {
            if (response.success && window.autoBuyerActive) {

                window.searchCountBeforePause--;
                writeToDebugLog('Received ' + response.data.items.length + ' items');

                var maxPurchases = 3;
                if ($('#ab_max_purchases').val() !== '') {
                    maxPurchases = Math.max(1, parseInt($('#ab_max_purchases').val()));
                }

                if (window.currentPage <= 20 && response.data.items.length === 21) {
                    window.currentPage++;
                } else {
                    window.currentPage = 1;
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

                    let expires = services.Localization.localizeAuctionTimeRemaining(auction.expires);                 

                    let buyNowPrice = auction.buyNowPrice;
                    let currentBid = auction.currentBid || auction.startingBid;
                    let isBid = auction.currentBid;
                    let bidPrice = parseInt(jQuery('#ab_max_bid_price').val());

                    let priceToBid = (window.bidExact) ? bidPrice : ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice);

                    let checkPrice = (window.bidExact) ? priceToBid : ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid);
                     
                    writeToDebugLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + auction.tradeId + '] [' + expires + '] ' + buyNowPrice);

                    if (window.autoBuyerActive && buyNowPrice <= parseInt(jQuery('#ab_buy_price').val()) && buyNowPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {
                        writeToDebugLog('Buy Price :' + jQuery('#ab_buy_price').val());
                        buyPlayer(player, buyNowPrice, true);

                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    } else if (window.autoBuyerActive && bidPrice && currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {

                        if (auction.expires > expiresIn) {
                            writeToDebugLog('Ignoring Item [' + auction.tradeId + '] as it expires on [ ' + expires + ']');
                            continue;
                        }

                        writeToDebugLog('Bid Price :' + bidPrice);
                        buyPlayer(player, checkPrice);
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    }
                };
            }
            else if (!response.success) {
                if (response.status == HttpStatusCode.CAPTCHA_REQUIRED) {
                    writeToLog('Autostopping bot since Captcha got triggered');
                } else {
                    writeToLog('Autostopping bot as fetching search results failed, please check if you can access transfer market in Web App');
                }
                window.deactivateAutoBuyer(true);
            }
        }));
    }

    window.watchBidItems = function () {

        services.Item.clearTransferMarketCache();

        services.Item.requestWatchedItems().observe(this, function (t, response) {

            var bidPrice = parseInt(jQuery('#ab_max_bid_price').val());
            var sellPrice = parseInt(jQuery('#ab_sell_price').val());

            let activeItems = response.data.items.filter(function (item) {
                return item._auction && item._auction._tradeState === "active";
            });

            services.Item.refreshAuctions(activeItems).observe(this, function (t, refreshResponse) {
                services.Item.requestWatchedItems().observe(this, function (t, watchResponse) {
                    if (window.autoBuyerActive && bidPrice) {

                        let outBidItems = watchResponse.data.items.filter(function (item) {
                            return item._auction._bidState === "outbid" && item._auction._tradeState === "active";
                        });

                        for (var i = 0; i < outBidItems.length; i++) {

                            let player = outBidItems[i];
                            let auction = player._auction;

                            let isBid = auction.currentBid;

                            let currentBid = auction.currentBid || auction.startingBid;

                            let priceToBid = (window.bidExact) ? bidPrice : ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice);                             

                            let checkPrice = (window.bidExact) ? bidPrice : ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid);

                            if (window.autoBuyerActive && currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber) {
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

                    if (window.autoBuyerActive && sellPrice && !isNaN(sellPrice)) {

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
            });
        });
    }

    window.buyPlayer = function (player, price, isBin) {
        setTimeout(function () {
            services.Item.bid(player, price).observe(this, (function (sender, data) {
                if (data.success) {

                    if (isBin) {
                        window.purchasedCardCount++;
                    }

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
        }, 800);
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

            if (window.futStatistics.unsoldItems && window.reListEnabled) {
                services.Item.relistExpiredAuctions().observe(this, function (t, response) { });
            }

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

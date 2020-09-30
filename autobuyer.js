  
// ==UserScript==
// @name         FUT 20 Autobuyer with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/chithakumar13/Fifa-AutoBuyer/blob/master/autobuyer.js
// @description  FUT Snipping Tool
// @author       CK Algos
// @match        https://www.ea.com/uk/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.getMaxSearchBid = function(min, max) {
        return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
    };

    window.searchCount = 0;

    window.initStatisics = function() {
        window.futStatistics = {
            soldItems: '-',
            unsoldItems: '-',
            activeTransfers: '-',
            availableItems: '-',
            coins: '-',
        };

        window.timers = {
            search: window.createTimeout(0, 0),
            coins: window.createTimeout(0, 0),
            transferList: window.createTimeout(0, 0),
        };
    };
    
    window.bids = [];

    window.createTimeout = function(time, interval) {
        return {
            start: time,
            finish: time + interval,
        };
    };

    window.processor = window.setInterval(function() {
        if (window.autoBuyerActive) {
            var time = (new Date()).getTime();

            if (window.timers.search.finish == 0 || window.timers.search.finish <= time) {
                window.searchFutMarket(null, null, null);

                window.timers.search = window.createTimeout(time, window.getRandomWait());
            }

            if (window.timers.coins.finish == 0 || window.timers.coins.finish <= time) {
                window.futStatistics.coins = services.User.getUser().coins.amount.toLocaleString();

                window.timers.coins = window.createTimeout(time, 2500);
            }

            if (window.timers.transferList.finish == 0 || window.timers.transferList.finish <= time) {
                window.updateTransferList();

                window.timers.transferList = window.createTimeout(time, 30000);
            }
        } else {
            window.initStatisics();
        }

        window.updateStatistics();
    }, 500);

    window.searchFutMarket = function(sender, event, data) {
        if (!window.autoBuyerActive) {
            return;
        }

        var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;

        searchCriteria.maxBid = window.getMaxSearchBid(300000, 800000);

        services.Item.clearTransferMarketCache();

        services.Item.searchTransferMarket(searchCriteria, 1).observe(this, (function(sender, response) {
            if (response.success) {
                writeToDebugLog('Received ' + response.data.items.length + ' items');

                var maxPurchases = 3;
                if ($('#ab_max_purchases').val() !== '') {
                    maxPurchases = Math.max(1, parseInt($('#ab_max_purchases').val()));
                }

                response.data.items.sort(function(a, b) {
                    var priceDiff = a._auction.buyNowPrice - b._auction.buyNowPrice;

                    if (priceDiff != 0) {
                        return priceDiff;
                    }

                    return a._auction.expires - b._auction.expires;
                });

                for (var i = 0; i < response.data.items.length; i++) {
                    var player = response.data.items[i];
                    var auction = player._auction; 

                    var buyNowPrice = auction.buyNowPrice;
                    var tradeId = auction.tradeId;
                    var tradeState = auction.tradeState;

                    var expires = services.Localization.localizeAuctionTimeRemaining(auction.expires); 
                    writeToDebugLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + auction.tradeId + '] [' + expires + '] ' + buyNowPrice);

                    writeToDebugLog('Buy Price :' + jQuery('#ab_buy_price').val()); 
                    
                    
                    if (buyNowPrice <= parseInt(jQuery('#ab_buy_price').val()) && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {
                        buyPlayer(player, buyNowPrice);
                        
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

    window.buyPlayer = function(player, price) {
        services.Item.bid(player, price).observe(this, (function(sender, data){
            if (data.success) {
                writeToLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + player._auction.tradeId + '] ' + price + ' bought');
                var sellPrice = parseInt(jQuery('#ab_sell_price').val());
                if (sellPrice !== 0 && !isNaN(sellPrice)) {
                    writeToLog(' -- Selling for: ' + sellPrice);
                    window.sellRequestTimeout = window.setTimeout(function() {
                        services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                    }, window.getRandomWait());
                }
            } else {
                writeToLog(player._staticData.firstName + ' ' + player._staticData.lastName + ' [' + player._auction.tradeId + '] ' + price + ' buy failed');
            }
        }));
    }

    window.getSellBidPrice = function(bin) {
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

    window.updateTransferList = function() {
        services.Item.requestTransferItems().observe(this, function(t, response) {
            window.futStatistics.soldItems = response.data.items.filter(function(item) {
                return item.getAuctionData().isSold();
            }).length;

            window.futStatistics.unsoldItems = response.data.items.filter(function(item) {
                return !item.getAuctionData().isSold() && item.getAuctionData().isExpired();
            }).length;

            window.futStatistics.activeTransfers = response.data.items.filter(function(item) {
                return item.getAuctionData().isSelling();
            }).length;

            window.futStatistics.availableItems = response.data.items.filter(function(item) {
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

    window.clearSoldItems = function() {
        services.Item.clearSoldItems().observe(this, function(t, response) {});
    }

    function getLeagueIdByAbbr(abbr) {
        var leagues = Object.values(repositories.TeamConfig._leagues._collection['11']._leagues._collection);
        var leagueId = 0;
        for(var i = 0; i < leagues.length; i++) {
            if (abbr === leagues[i].abbreviation) {
                leagueId = leagues[i].id;
                break;
            }
        }

        return leagueId;
    }
})();

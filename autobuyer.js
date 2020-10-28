// ==UserScript==
// @name         FUT 21 Autobuyer with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      0.8
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

    window.getRandNum = function (min, max) {
        return Math.round((Math.random() * (max - min) + min));
    };
    window.getItemName = function(itemObj){
        let item_name = window.format_string(itemObj._staticData.firstName.split(" ")[0] + ' ' + itemObj._staticData.lastName.split(" ")[0], 25);
        if (itemObj.type == "training") {
            item_name = window.format_string(itemObj._staticData.name, 25)
        }
        return item_name
    };
    window.winCount = 0;
    window.lossCount = 0;
    window.bidCount = 0;
    window.searchCount = 0;

    window.errorCodeLookUp = {
        '521': 'Server Rejected the request',
        '512': 'Server Rejected the request',
        '429': 'Bidding Rejected, too many request received from this user',
        '426': 'Bidding Rejected, other user won the (card / bid)',
        '461': 'Bidding Rejected, other user won the (card / bid)',
    };

    window.format_string = function (str, len) {
        if (str.length <= len) {
            str += " ".repeat(len - str.length)
        }
        return str;
    };

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

        // Randomize search criteria min bid to clear cache
        searchCriteria.minBid = window.getRandNum(1, 30) * 10;
        searchCriteria.minBuy = window.getRandNum(1, 30) * 10;
        window.mbid = searchCriteria.minBid;
        window.mBuy = searchCriteria.minBuy;


        if ($('#ab_card_count').val() !== '') {
            window.buyCardCount = parseInt(jQuery('#ab_card_count').val());
        } else {
            window.buyCardCount = undefined;
        }

        services.Item.searchTransferMarket(searchCriteria, window.currentPage).observe(this, (function (sender, response) {
            if (response.success && window.autoBuyerActive) {

                window.searchCountBeforePause--;

                let min_rate_txt = jQuery('#ab_min_rate').val();
                let max_rate_txt = jQuery('#ab_max_rate').val();
                if (min_rate_txt == '') {
                    min_rate_txt = "10"
                }
                if (max_rate_txt == '') {
                    max_rate_txt = "100"
                }
                let selected_min_rate = parseInt(min_rate_txt);
                let selected_max_rate = parseInt(max_rate_txt);

                writeToDebugLog('= Received ' + response.data.items.length + ' items - from page ('+ window.currentPage + ')  =>  config: (minbid:' + window.mbid + '-minbuy:' + window.mBuy + ') ');

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
                if (response.data.items.length > 0){
                    writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                    writeToDebugLog('| rating   | player name               | bid    | buy    | time            | action');
                    writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                }
                for (var i = 0; i < response.data.items.length; i++) {
                    let action_txt = 'none';
                    let player = response.data.items[i];
                    let auction = player._auction;
                    let player_rating = parseInt(player.rating);
                    let rating_ok = false;
                    let rating_ok_txt = "no";
                    if (player_rating >= selected_min_rate && player_rating <= selected_max_rate) {
                        rating_ok = true;
                        rating_ok_txt = "ok";
                    } else {
                        action_txt = 'ignore as rating does not fit criteria';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | '  + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }

                    let expires = services.Localization.localizeAuctionTimeRemaining(auction.expires);

                    let buyNowPrice = auction.buyNowPrice;
                    let currentBid = auction.currentBid || auction.startingBid;
                    let isBid = auction.currentBid;
                    let bidPrice = parseInt(jQuery('#ab_max_bid_price').val());


                    let priceToBid = (window.bidExact) ? bidPrice : ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice);
                    let checkPrice = (window.bidExact) ? priceToBid : ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid);

                    let bid_buy_txt = "(bid: " + window.format_string(currentBid.toString(), 6) + " / buy:" + window.format_string(buyNowPrice.toString(), 7) + ")"
                    let player_name =  window.getItemName(player);
                    let expire_time = window.format_string(expires, 15);
                    let rating_txt = "(" +player_rating + "-" + rating_ok_txt + ") ";
                    //writeToDebugLog(rating_txt + player_name + '=>' + expire_time + '] ' + bid_buy_txt);

                    //
                    let bid_txt = window.format_string(currentBid.toString(), 6)
                    let buy_txt = window.format_string(buyNowPrice.toString(), 6)

                    if (rating_ok && window.autoBuyerActive && buyNowPrice <= parseInt(jQuery('#ab_buy_price').val()) && buyNowPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {
                        action_txt = 'attempt buy: ' + jQuery('#ab_buy_price').val();
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | '  + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        buyPlayer(player, buyNowPrice, true);
                        setTimeout(function () {
                        }, 500);
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    } else if (rating_ok && window.autoBuyerActive && bidPrice && currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId) && --maxPurchases >= 0) {

                        if (auction.expires > expiresIn) {
                            action_txt = 'ignore because of expiry time';
                            writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | '  + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                            continue;
                        }

                        action_txt = 'attempt bid: ' + bidPrice;
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | '  + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        buyPlayer(player, checkPrice);
                        //setTimeout(function (){}, 1000);
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    }else{
                        action_txt = 'skip >>>';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | '  + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    }

                };
                if (response.data.items.length > 0){
                    writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                }
            } else if (!response.success) {
                if (response.status == HttpStatusCode.CAPTCHA_REQUIRED) {
                    writeToLog('------------------------------------------------------------------------------------------');
                    writeToLog('[!!!] Autostopping bot since Captcha got triggered');
                    writeToLog('------------------------------------------------------------------------------------------');
                } else {
                    writeToLog('------------------------------------------------------------------------------------------');
                    writeToLog('[!!!] Autostopping bot as search failed, please check if you can access transfer market in Web App');
                    writeToLog('------------------------------------------------------------------------------------------');
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
                            let player_name =  window.getItemName(player);
                            writeToLog( " ($$$) "+ player_name + '[' + player._auction.tradeId + '] -- Selling for: ' + sellPrice);
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
    };

    window.buyPlayer = function (player, price, isBin) {
            services.Item.bid(player, price).observe(this, (function (sender, data) {
                let price_txt = window.format_string(price.toString(), 6)
                let player_name = window.getItemName(player);
                if (data.success) {

                    if (isBin) {
                        window.purchasedCardCount++;
                    }

                    var sellPrice = parseInt(jQuery('#ab_sell_price').val());
                    if (isBin && sellPrice !== 0 && !isNaN(sellPrice)) {
                        window.winCount++;
                        let sym = " W:" + window.format_string(window.winCount.toString(), 4);
                        writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | selling for: ' + sellPrice : ' | bid | success |' + ' selling for: ' + sellPrice));
                        window.sellRequestTimeout = window.setTimeout(function () {
                            services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                        }, window.getRandomWait());
                    }else{
                        window.bidCount++;
                        let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                        writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | move to unassigned' : ' | bid | success | waiting to expire'));
                    }
                } else {
                    window.lossCount++;
                    let sym = " L:" + window.format_string(window.lossCount.toString(), 4);
                    writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | failure |' : ' | bid | failure |') + ' ERR: ' + data.status + '-' + (errorCodeLookUp[data.status] || ''));
                }
            }));
    };

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
                services.Item.relistExpiredAuctions().observe(this, function (t, response) {
                });
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
                writeToLog('------------------------------------------------------------------------------------------');
                writeToLog('Report] > ' + window.futStatistics.soldItems + " item(s) sold");
                writeToLog('------------------------------------------------------------------------------------------');
                window.clearSoldItems();
            }
        });
    };

    window.clearSoldItems = function () {
        services.Item.clearSoldItems().observe(this, function (t, response) {
        });
    }
})();

// ==UserScript==
// @name         FUT 21 Autobuyer Menu with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/chithakumar13/Fifa-AutoBuyer/blob/master/autobuyermenu.js
// @description  FUT Snipping Tool
// @author       CK Algos
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.UTAutoBuyerViewController = function () {
        UTMarketSearchFiltersViewController.call(this);
        this._jsClassName = "UTAutoBuyerViewController";
    }

    window.sellList = [];
    window.autoBuyerActive = false;
    window.botStartTime = null; 

    window.activateAutoBuyer = function() {
        if (window.autoBuyerActive) {
            return;
        } 

        window.botStartTime = new Date();
        window.autoBuyerActive = true;
        window.notify('Autobuyer Started');
    }

    window.deactivateAutoBuyer = function() {
        if (!window.autoBuyerActive) {
            return;
        }

        window.previousBid == null;
        window.previousMaxBid == null;
        window.botStartTime = null;
        window.autoBuyerActive = false;
        window.notify('Autobuyer Stopped');
    }

    utils.JS.inherits(UTAutoBuyerViewController, UTMarketSearchFiltersViewController)
    window.UTAutoBuyerViewController.prototype.init = function init() {
        if (!this.initialized) {
            //getAppMain().superclass(),
            this._viewmodel || (this._viewmodel = new viewmodels.BucketedItemSearch),
                this._viewmodel.searchCriteria.type === enums.SearchType.ANY && (this._viewmodel.searchCriteria.type = enums.SearchType.PLAYER);
            var t = gConfigurationModel.getConfigObject(models.ConfigurationModel.KEY_ITEMS_PER_PAGE)
            , count = 1 + (utils.JS.isValid(t) ? t[models.ConfigurationModel.ITEMS_PER_PAGE.TRANSFER_MARKET] : 15);
            this._viewmodel.searchCriteria.count = count,
                this._viewmodel.searchFeature = enums.ItemSearchFeature.MARKET;
            var view = this.getView();
            view.addTarget(this, this._eResetSelected, UTMarketSearchFiltersView.Event.RESET),
                view.addTarget(this, window.activateAutoBuyer, UTMarketSearchFiltersView.Event.SEARCH),
                view.addTarget(this, this._eFilterChanged, UTMarketSearchFiltersView.Event.FILTER_CHANGE),
                view.addTarget(this, this._eMinBidPriceChanged, UTMarketSearchFiltersView.Event.MIN_BID_PRICE_CHANGE),
                view.addTarget(this, this._eMaxBidPriceChanged, UTMarketSearchFiltersView.Event.MAX_BID_PRICE_CHANGE),
                view.addTarget(this, this._eMinBuyPriceChanged, UTMarketSearchFiltersView.Event.MIN_BUY_PRICE_CHANGE),
                view.addTarget(this, this._eMaxBuyPriceChanged, UTMarketSearchFiltersView.Event.MAX_BUY_PRICE_CHANGE),
                this._viewmodel.getCategoryTabVisible() && (view.initTabMenuComponent(),
                                                            view.getTabMenuComponent().addTarget(this, this._eSearchCategoryChanged, enums.Event.TAP)),
                this._squadContext ? isPhone() || view.addClass("narrow") : view.addClass("floating"),
                view.getPlayerNameSearch().addTarget(this, this._ePlayerNameChanged, enums.Event.CHANGE),
                view.__root.style = "width: 50%; float: left;";
        }
    };

    function addTabItem() {
        if (services.Localization && jQuery('h1.title').html() === services.Localization.localize("navbar.label.home")) {
            getAppMain().getRootViewController().showGameView = function showGameView() {
                if (this._presentedViewController instanceof UTGameTabBarController)
                    return !1;
                var t, i = new UTGameTabBarController,
                    s = new UTGameFlowNavigationController,
                    o = new UTGameFlowNavigationController,
                    l = new UTGameFlowNavigationController,
                    u = new UTGameFlowNavigationController,
                    h = new UTGameFlowNavigationController,
                    p = new UTTabBarItemView,
                    _ = new UTTabBarItemView,
                    g = new UTTabBarItemView,
                    m = new UTTabBarItemView,
                    S = new UTTabBarItemView;
                if (s.initWithRootController(new UTHomeHubViewController),
                    o.initWithRootController(new UTSquadsHubViewController),
                    l.initWithRootController(new UTTransfersHubViewController),
                    u.initWithRootController(new UTStoreViewController),
                    h.initWithRootController(new UTClubHubViewController),
                    p.init(),
                    p.setTag(UTGameTabBarController.TabTag.HOME),
                    p.setText(services.Localization.localize("navbar.label.home")),
                    p.addClass("icon-home"),
                    _.init(),
                    _.setTag(UTGameTabBarController.TabTag.SQUADS),
                    _.setText(services.Localization.localize("nav.label.squads")),
                    _.addClass("icon-squad"),
                    g.init(),
                    g.setTag(UTGameTabBarController.TabTag.TRANSFERS),
                    g.setText(services.Localization.localize("nav.label.trading")),
                    g.addClass("icon-transfer"),
                    m.init(),
                    m.setTag(UTGameTabBarController.TabTag.STORE),
                    m.setText(services.Localization.localize("navbar.label.store")),
                    m.addClass("icon-store"),
                    S.init(),
                    S.setTag(UTGameTabBarController.TabTag.CLUB),
                    S.setText(services.Localization.localize("nav.label.club")),
                    S.addClass("icon-club"),
                    s.tabBarItem = p,
                    o.tabBarItem = _,
                    l.tabBarItem = g,
                    u.tabBarItem = m,
                    h.tabBarItem = S,
                    t = [s, o, l, u, h],
                    !isPhone()) {
                    var C = new UTGameFlowNavigationController,
                        T = new UTGameFlowNavigationController,
                        AB = new UTGameFlowNavigationController, //added row
                        v = new UTGameFlowNavigationController;
                    C.initWithRootController(new UTSBCHubViewController),
                        T.initWithRootController(new UTLeaderboardsHubViewController),
                        AB.initWithRootController(new UTAutoBuyerViewController), //added line
                        v.initWithRootController(new UTAppSettingsViewController);
                    var L = new UTTabBarItemView;
                    L.init(),
                        L.setTag(UTGameTabBarController.TabTag.SBC),
                        L.setText(services.Localization.localize("nav.label.sbc")),
                        L.addClass("icon-sbc");
                    var I = new UTTabBarItemView;
                    I.init(),
                        I.setTag(UTGameTabBarController.TabTag.LEADERBOARDS),
                        I.setText(services.Localization.localize("nav.label.leaderboards")),
                        I.addClass("icon-leaderboards");

                    //added section
                    var AutoBuyerTab = new UTTabBarItemView;
                    AutoBuyerTab.init(),
                        AutoBuyerTab.setTag(8),
                        AutoBuyerTab.setText('AutoBuyer'),
                        AutoBuyerTab.addClass("icon-transfer");

                    var P = new UTTabBarItemView;
                    P.init(),
                        P.setTag(UTGameTabBarController.TabTag.SETTINGS),
                        P.setText(services.Localization.localize("button.settings")),
                        P.addClass("icon-settings"),
                        C.tabBarItem = L,
                        T.tabBarItem = I,
                        v.tabBarItem = P,
                        AB.tabBarItem = AutoBuyerTab, //added line
                        t = t.concat([C, T, v, AB]) //added line
                }
                return i.initWithViewControllers(t),
                    i.getView().addClass("game-navigation"),
                    this.presentViewController(i, !0, function() {
                    services.URL.hasDeepLinkURL() && services.URL.processDeepLinkURL()
                }),
                    !0
            };

            getAppMain().getRootViewController().showGameView();
        } else {
            window.setTimeout(addTabItem ,1000);
        }
    };

    function createAutoBuyerInterface()
    {
        if (services.Localization && jQuery('h1.title').html() === services.Localization.localize("navbar.label.home")) {
            window.hasLoadedAll = true;
        }

        if (window.hasLoadedAll && getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._jsClassName) {
            if (!jQuery('.SearchWrapper').length) {
                var view = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._view;
                jQuery(view.__root.parentElement).prepend(
                    '<div id="InfoWrapper" class="ut-navigation-bar-view navbar-style-landscape">' +
                    '   <h1 class="title">AUTOBUYER STATUS: <span id="ab_status"></span> | REQUEST COUNT: <span id="ab_request_count">0</span></h1>' + 
                    '   <div class="view-navbar-clubinfo">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <div class="view-navbar-clubinfo-name">' +
                    '               <div style="float: left;">Search:</div>' +
                    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
                    '                   <div id="ab_search_progress" style="background: #000; height: 10px; width: 0%"></div>' +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="view-navbar-clubinfo-name">' +
                    '               <div style="float: left;">Statistics:</div>' +
                    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
                    '                   <div id="ab_statistics_progress" style="background: #000; height: 10px; width: 0%"></div>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-currency" style="margin-left: 10px;">' + 
                    '       <div class="view-navbar-currency-coins" id="ab_coins"></div>' + 
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo">' + 
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Sold Items: <span id="ab-sold-items"></span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Unsold Items: <span id="ab-unsold-items"></span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo" style="border: none;">' + 
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Available Items: <span id="ab-available-items"></span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Active transfers: <span id="ab-active-transfers"></span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );

                jQuery(view.__root.parentElement).append('<div id="SearchWrapper" style="width: 50%; right: 50%"><textarea readonly id="progressAutobuyer" style="font-size: 15px; width: 100%;height: 58%;"></textarea><label>Search Results:</label><br/><textarea readonly id="autoBuyerFoundLog" style="font-size: 10px; width: 100%;height: 26%;"></textarea></div>');

                writeToLog('Autobuyer Ready');
            }

            if (jQuery('.search-prices').first().length) {
                if (!jQuery('#ab_buy_price').length) {
                    jQuery('.search-prices').first().append(
                        '<div class="search-price-header">' + 
                        '   <h1 class="secondary">AB Settings:</h1>'+
                        '</div>' +
                        '<div class="price-filter">' + 
                        '   <div class="info">' + 
                        '       <span class="secondary label">Sell Price:</span><br/><small>Recieve After Tax: <span id="sell_after_tax">0</span></small>' + 
                        '   </div>' + 
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' + 
                        '           <input type="tel" class="numericInput" id="ab_sell_price" placeholder="7000">' + 
                        '       </div>' + 
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' + 
                        '       <span class="secondary label">Buy Price:</span>' + 
                        '   </div>' + 
                        '   <div class="buttonInfo">' + 
                        '       <div class="inputBox">' + 
                        '           <input type="tel" class="numericInput" id="ab_buy_price" placeholder="5000">' + 
                        '       </div>' + 
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' + 
                        '       <span class="secondary label">Bid Price:</span>' + 
                        '   </div>' + 
                        '   <div class="buttonInfo">' + 
                        '       <div class="inputBox">' + 
                        '           <input type="tel" class="numericInput" id="ab_max_bid_price" placeholder="5000">' + 
                        '       </div>' + 
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Wait Time:<br/><small>(random second range eg. 7-15)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_wait_time" placeholder="7-15">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Min clear count:<br/><small>(clear sold items if count is not less than)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="ab_min_delete_count" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max purchases per search request:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_max_purchases" placeholder="3">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Stop After:<br/><small>(S for seconds, M for Minutes, H for hours)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_stop_after" placeholder="1H">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Concurrent Search Request:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="ab_con_request" placeholder="1">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>'
                    );
                }
            }

            if (!jQuery('#search_cancel_button').length) {
                jQuery('#InfoWrapper').next().find('.button-container button').first().after('<button class="btn-standard" id="search_cancel_button">Stop</button>')
            }
        } else {
            window.setTimeout(createAutoBuyerInterface, 1000);
        }
    }

    jQuery(document).on('click', '#search_cancel_button', deactivateAutoBuyer);

    jQuery(document).on('keyup', '#ab_sell_price', function(){
        jQuery('#sell_after_tax').html((jQuery('#ab_sell_price').val() - ((parseInt(jQuery('#ab_sell_price').val()) / 100) * 5)).toLocaleString());
    });

    window.updateAutoTransferListStat = function() {
        if (!window.autoBuyerActive) {
            return;
        }

        window.updateTransferList();
    };

    window.writeToLog = function(message) {
        var $log = jQuery('#progressAutobuyer');
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.writeToDebugLog = function(message) {
        var $log = jQuery('#autoBuyerFoundLog');
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.notify = function(message) {
        services.Notification.queue([message, enums.UINotificationType.POSITIVE])
    };

    window.getRandomWait = function() {
        var addedTime = 0; 
        
        var wait = [7, 15];
        if (jQuery('#ab_wait_time').val() !== '') {
            wait = jQuery('#ab_wait_time').val().split('-');
        }
        window.searchCount++;
        return (Math.round((Math.random() * (wait[1] - wait[0]) + wait[0])) * 1000);
    };

    window.getTimerProgress = function (timer) {
        var time = (new Date()).getTime();

        return (Math.max(0, timer.finish - time) / (timer.finish - timer.start)) * 100;
    };

    window.updateStatistics = function () {
        jQuery('#ab_search_progress').css('width', window.getTimerProgress(window.timers.search));
        jQuery('#ab_statistics_progress').css('width', window.getTimerProgress(window.timers.transferList));

        jQuery('#ab_request_count').html(window.searchCount);

        jQuery('#ab_coins').html(window.futStatistics.coins);

        if (window.autoBuyerActive) {
            jQuery('#ab_status').css('color', '#2cbe2d').html('RUNNING');
        } else {
            jQuery('#ab_status').css('color', 'red').html('IDLE');
        }

        jQuery('#ab-sold-items').html(window.futStatistics.soldItems);
        jQuery('#ab-unsold-items').html(window.futStatistics.unsoldItems);
        jQuery('#ab-available-items').html(window.futStatistics.availableItems);
        jQuery('#ab-active-transfers').html(window.futStatistics.activeTransfers);

        if (window.futStatistics.unsoldItems) {
            jQuery('#ab-unsold-items').css('color', 'red');
        } else {
            jQuery('#ab-unsold-items').css('color', '');
        }

        if (window.futStatistics.availableItems) {
            jQuery('#ab-available-items').css('color', 'orange');
        } else {
            jQuery('#ab-available-items').css('color', '');
        }
    };

    window.hasLoadedAll = false;
    window.searchCount = 0;
    createAutoBuyerInterface();
    addTabItem();
})();

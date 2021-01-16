// ==UserScript==
// @name         FUT 21 Autobuyer Menu with TamperMonkey
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @updateURL    https://raw.githubusercontent.com/chithakumar13/Fifa21-AutoBuyer/master/autobuyer.js
// @downloadURL  https://raw.githubusercontent.com/chithakumar13/Fifa21-AutoBuyer/master/autobuyer.js
// @description  FUT Snipping Tool
// @author       CK Algos
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// ==/UserScript==

(function () {
    'use strict';

    window.controllerInstance = null;
    window.UTAutoBuyerViewController = function () {
        UTMarketSearchFiltersViewController.call(this);
        window.controllerInstance = this;
        this._jsClassName = "UTAutoBuyerViewController";
    };

    window.sellList = [];
    window.autoBuyerActive = false;
    window.botStartTime = null;
    window.searchCountBeforePause = 10;
    window.defaultStopTime = 10;
    window.currentPage = 1;
    window.reListEnabled = false;
    window.currentChemistry = -1;
    window.purchasedCardCount = 0;
    window.bidExact = false;
    window.selectedFilters = [];
    window.useRandMinBuy = false;
    window.useRandMinBid = false;
    window.addDelayAfterBuy = false;
    window.captchaCloseTab = false;
    window.isSearchInProgress = false;
    window.toggleMessageNotification = false;
    window.botStopped = true;
    window.userWatchItems = [];
    window.eachFilterSearch = null;

    var _searchViewModel = null;


// DIV names
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    var nameFilterDropdown = '#elem_' + makeid(15),
        nameSelectedFilter = '#elem_' + makeid(15),
        nameAbBuyPrice = '#elem_' + makeid(15),
        nameAbCardCount = '#elem_' + makeid(15),
        nameAbMaxBid = '#elem_' + makeid(15),
        nameAbItemExpiring = '#elem_' + makeid(15),
        nameAbBidExact = '#elem_' + makeid(15),
        nameAbSellPrice = '#elem_' + makeid(15),
        nameAbMinDeleteCount = '#elem_' + makeid(15),
        nameAbSellToggle = '#elem_' + makeid(15),
        nameAbWaitTime = '#elem_' + makeid(15),
        nameAbMaxPurchases = '#elem_' + makeid(15),
        nameAbCycleAmount = '#elem_' + makeid(15),
        nameAbPauseFor = '#elem_' + makeid(15),
        nameAbStopAfter = '#elem_' + makeid(15),
        nameAbMinRate = '#elem_' + makeid(15),
        nameAbMaxRate = '#elem_' + makeid(15),
        nameAbRandMinBidInput = '#elem_' + makeid(15),
        nameAbRandMinBuyInput = '#elem_' + makeid(15),
        nameAbRandMinBuyToggle = '#elem_' + makeid(15),
        nameAbRandMinBidToggle = '#elem_' + makeid(15),
        nameAbAddBuyDelay = '#elem_' + makeid(15),
        nameAbAddFilterGK = '#elem_' + makeid(15),
        nameAbCloseTabToggle = '#elem_' + makeid(15),
        nameAbMessageNotificationToggle = '#elem_' + makeid(15),
        nameAbSoundToggle = '#elem_' + makeid(15),
        nameTelegramBotToken = '#elem_' + makeid(15),
        nameTelegramChatId = '#elem_' + makeid(15),
        nameTelegramBuy = '#elem_' + makeid(15),
        nameProgressAutobuyer = '#elem_' + makeid(15),
        nameAutoBuyerFoundLog = '#elem_' + makeid(15),
        nameSearchCancelButton = '#elem_' + makeid(15),
        nameInfoWrapper = '#elem_' + makeid(15),
        namePreserveChanges = '#elem_' + makeid(15),
        nameClearLogButton = '#elem_' + makeid(15),
        nameCalcBinPrice = '#elem_' + makeid(15),
        nameTestNotification = '#elem_' + makeid(15),
        nameSelectFilterCount = '#elem_' + makeid(15),
        nameDeleteFilter = '#elem_' + makeid(15),
        nameAbSolveCaptcha = '#elem_' + makeid(15),
        nameSellAfterTax = '#elem_' + makeid(15),
        nameAbSearchProgress = '#elem_' + makeid(15),
        nameAbStatisticsProgress = '#elem_' + makeid(15),
        nameAbRequestCount = '#elem_' + makeid(15),
        nameAbCoins = '#elem_' + makeid(15),
        nameAbStatus = '#elem_' + makeid(15),
        nameAbSoldItems = '#elem_' + makeid(15),
        nameAbUnsoldItems = '#elem_' + makeid(15),
        nameAbAvailableItems = '#elem_' + makeid(15),
        nameAbActiveTransfers = '#elem_' + makeid(15),
        nameAbNumberFilterSearch = '#elem_' + makeid(15),
        nameAbStopErrorCode = '#elem_' + makeid(15),
        nameSearchWrapper = '#elem_' + makeid(15),
        nameWinMp3 = '#elem_' + makeid(15),
        nameCapatchaMp3 = '#elem_' + makeid(15),
        nameProxyAddress = '#elem_' + makeid(15),
        nameProxyPort = '#elem_' + makeid(15),
        nameProxyLogin = '#elem_' + makeid(15),
        nameAntiCaptchKey = '#elem_' + makeid(15),
        nameProxyPassword = '#elem_' + makeid(15);

    window.loadFilter = function () {
        var filterName = $('select[name=filters] option').filter(':selected').val();
        loadFilterByName(filterName);
    };

    window.deleteFilter = function () {
        var filterName = $('select[name=filters] option').filter(':selected').val();
        if (filterName != 'Choose filter to load') {
            $(nameFilterDropdown + ` option[value="${filterName}"]`).remove();
            $(nameSelectedFilter + ` option[value="${filterName}"]`).remove();
            jQuery(nameSelectedFilter).find('option').attr("selected", false);
            window.setFilters();
            jQuery(nameFilterDropdown).prop('selectedIndex', 0);

            window.clearABSettings();
            window.controllerInstance._viewmodel.playerData = null;

            Object.assign(window.controllerInstance._viewmodel.searchCriteria, window.controllerInstance._viewmodel.defaultSearchCriteria);
            window.controllerInstance.viewDidAppear();

            GM_deleteValue(filterName);
            window.notify("Changes saved successfully");
        }
    };

    window.loadFilterByName = function (filterName) {

        let settingsJson = GM_getValue(filterName);

        if (!settingsJson) {
            return;
        }

        window.clearABSettings();

        settingsJson = JSON.parse(settingsJson);

        if (settingsJson.abSettings.buyPrice) {
            $(nameAbBuyPrice).val(settingsJson.abSettings.buyPrice);
        }

        if (settingsJson.abSettings.cardCount) {
            $(nameAbCardCount).val(settingsJson.abSettings.cardCount);
        }

        if (settingsJson.abSettings.maxBid) {
            $(nameAbMaxBid).val(settingsJson.abSettings.maxBid);
        }

        if (settingsJson.abSettings.itemExpiring) {
            $(nameAbItemExpiring).val(settingsJson.abSettings.itemExpiring);
        }

        if (settingsJson.abSettings.bidExact) {
            window.bidExact = settingsJson.abSettings.bidExact;
            jQuery(nameAbBidExact).addClass("toggled");
        }

        if (settingsJson.abSettings.sellPrice) {
            jQuery(nameAbSellPrice).val(settingsJson.abSettings.sellPrice);
        }

        if (settingsJson.abSettings.minDeleteCount) {
            jQuery(nameAbMinDeleteCount).val(settingsJson.abSettings.minDeleteCount);
        }

        if (settingsJson.abSettings.reListEnabled) {
            window.reListEnabled = settingsJson.abSettings.reListEnabled;
            jQuery(nameAbSellToggle).addClass("toggled");
        }

        if (settingsJson.abSettings.waitTime) {
            jQuery(nameAbWaitTime).val(settingsJson.abSettings.waitTime);
        }

        if (settingsJson.abSettings.maxPurchases) {
            jQuery(nameAbMaxPurchases).val(settingsJson.abSettings.maxPurchases);
        }

        if (settingsJson.abSettings.pauseCycle) {
            jQuery(nameAbCycleAmount).val(settingsJson.abSettings.pauseCycle);
        }

        if (settingsJson.abSettings.pauseFor) {
            jQuery(nameAbPauseFor).val(settingsJson.abSettings.pauseFor);
        }

        if (settingsJson.abSettings.stopAfter) {
            jQuery(nameAbStopAfter).val(settingsJson.abSettings.stopAfter);
        }

        if (settingsJson.abSettings.minRate) {
            jQuery(nameAbMinRate).val(settingsJson.abSettings.minRate);
        }

        if (settingsJson.abSettings.maxRate) {
            jQuery(nameAbMaxRate).val(settingsJson.abSettings.maxRate);
        }

        if (settingsJson.abSettings.randMinBid) {
            jQuery(nameAbRandMinBidInput).val(settingsJson.abSettings.randMinBid);
        }

        if (settingsJson.abSettings.randMinBuy) {
            jQuery(nameAbRandMinBuyInput).val(settingsJson.abSettings.randMinBuy);
        }

        if (settingsJson.abSettings.useRandMinBuy) {
            window.useRandMinBuy = settingsJson.abSettings.useRandMinBuy;
            jQuery(nameAbRandMinBuyToggle).addClass("toggled");
        }

        if (settingsJson.abSettings.useRandMinBid) {
            window.useRandMinBid = settingsJson.abSettings.useRandMinBid;
            jQuery(nameAbRandMinBidToggle).addClass("toggled");
        }

        if (settingsJson.abSettings.addDelayAfterBuy) {
            window.addDelayAfterBuy = settingsJson.abSettings.addDelayAfterBuy;
            jQuery(nameAbAddBuyDelay).addClass("toggled");
        }

        if (settingsJson.abSettings.addFilterGK) {
            window.addFilterGK = settingsJson.abSettings.addFilterGK;
            jQuery(nameAbAddFilterGK).addClass("toggled");
        }

        if (settingsJson.abSettings.captchaCloseTab) {
            window.captchaCloseTab = settingsJson.abSettings.captchaCloseTab;
            jQuery(nameAbCloseTabToggle).addClass("toggled");
        }

        if (settingsJson.abSettings.notificationEnabled) {
            window.notificationEnabled = settingsJson.abSettings.notificationEnabled;
            jQuery(nameAbMessageNotificationToggle).addClass("toggled");
        }

        if (settingsJson.abSettings.soundEnabled) {
            window.soundEnabled = settingsJson.abSettings.soundEnabled;
            jQuery(nameAbSoundToggle).addClass("toggled");
        }

        if (settingsJson.abSettings.autoSolveCaptcha) {
            window.autoSolveCaptcha = settingsJson.abSettings.autoSolveCaptcha;
            jQuery(nameAbSolveCaptcha).addClass("toggled");
        }

        if (settingsJson.abSettings.proxyAddress) {
            jQuery(nameProxyAddress).val(settingsJson.abSettings.proxyAddress);
        }
        if (settingsJson.abSettings.proxyPort) {
            jQuery(nameProxyPort).val(settingsJson.abSettings.proxyPort);
        }
        if (settingsJson.abSettings.proxyUserName) {
            jQuery(nameProxyLogin).val(settingsJson.abSettings.proxyUserName);
        }
        if (settingsJson.abSettings.proxyUserPassword) {
            jQuery(nameProxyPassword).val(settingsJson.abSettings.proxyUserPassword);
        }
        if (settingsJson.abSettings.antiCaptchKey) {
            jQuery(nameAntiCaptchKey).val(settingsJson.abSettings.antiCaptchKey);
        }

        if (settingsJson.abSettings.telegramBotToken) {
            jQuery(nameTelegramBotToken).val(settingsJson.abSettings.telegramBotToken);
        }
        if (settingsJson.abSettings.telegramChatID) {
            jQuery(nameTelegramChatId).val(settingsJson.abSettings.telegramChatID);
        }
        if (settingsJson.abSettings.telegramBuy) {
            jQuery(nameTelegramBuy).val(settingsJson.abSettings.telegramBuy);
        }

        let savedCriteria = settingsJson.searchCriteria || {};

        window.controllerInstance._viewmodel.playerData = {};

        if (!jQuery.isEmptyObject(savedCriteria)) {
            Object.assign(window.controllerInstance._viewmodel.searchCriteria, savedCriteria.criteria);
            Object.assign(window.controllerInstance._viewmodel.playerData, savedCriteria.playerData);
        }

        if (jQuery.isEmptyObject(window.controllerInstance._viewmodel.playerData)) {
            window.controllerInstance._viewmodel.playerData = null;
        }

        window.controllerInstance.viewDidAppear();
    }

    window.sendPinEvents = function (pageId) {
        services.PIN.sendData(PINEventType.PAGE_VIEW, {
            type: PIN_PAGEVIEW_EVT_TYPE,
            pgid: pageId
        });
    }

    window.sendNotificationToUser = function (message) {
        if (window.notificationEnabled) {
            let bot_token = jQuery(nameTelegramBotToken).val();
            let bot_chatID = jQuery(nameTelegramChatId).val();
            if (bot_token && bot_chatID) {
                let url = 'https://api.telegram.org/bot' + bot_token +
                    '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + message;
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        }
    }

    window.activateAutoBuyer = function (isStart) {
        if (window.autoBuyerActive) {
            return;
        }

        if (window.botStopped && !isStart) {
            return;
        }

        services.Item.requestWatchedItems().observe(this, function (t, response) {
            window.botStartTime = new Date();
            window.searchCountBeforePause = 10;
            window.currentChemistry = -1;
            window.currentPage = 1;
            if ($(nameAbCycleAmount).val() !== '') {
                window.searchCountBeforePause = parseInt($(nameAbCycleAmount).val());
            }
            window.defaultStopTime = window.searchCountBeforePause;
            window.autoBuyerActive = true;
            window.botStopped = false;

            if (isStart) {
                window.purchasedCardCount = 0;
                window.firstSearch = true;
                window.userWatchItems = response.data.items.filter((item) => item._auction).map((item) => item._auction.tradeId) || [];
                window.isSearchInProgress = false;
                if (window.userWatchItems.length) {
                    writeToDebugLog(`Found ${window.userWatchItems.length} items in users watch list and ignored from selling`);
                }
                window.notify('Autobuyer Started');
            }
            else {
                window.notify('Autobuyer Resumed');
            }
        });
    };

    window.deactivateAutoBuyer = function (isStopped) {
        if (window.botStopped && !window.autoBuyerActive) {
            return;
        }

        window.autoBuyerActive = false;
        window.botStartTime = null;
        window.searchCountBeforePause = 10;
        window.currentChemistry = -1;
        window.currentPage = 1;

        if (isStopped) {
            window.purchasedCardCount = 0;
            window.botStopped = true;
            window.isSearchInProgress = false;
        }

        window.defaultStopTime = window.searchCountBeforePause;
        window.notify((isStopped) ? 'Autobuyer Stopped' : 'Autobuyer Paused');
    };

    window.play_audio = function (event_type) {
        if (window.soundEnabled) {
            var elem = document.getElementById(nameWinMp3.substring(1));

            if (event_type == "capatcha") {
                elem = document.getElementById(nameCapatchaMp3.substring(1));
            }

            elem.currentTime = 0;
            elem.play();
        }
    };

    window.clearLog = function () {
        var $progressLog = jQuery(nameProgressAutobuyer);
        var $buyerLog = jQuery(nameAutoBuyerFoundLog);
        $progressLog.val("");
        $buyerLog.val("");
    };

    utils.JS.inherits(UTAutoBuyerViewController, UTMarketSearchFiltersViewController);

    window.UTAutoBuyerViewController.prototype.init = function init() {
        if (!this.initialized) {
            //getAppMain().superclass(),
            this._viewmodel || (this._viewmodel = new viewmodels.BucketedItemSearch),
            this._viewmodel.searchCriteria.type === enums.SearchType.ANY && (this._viewmodel.searchCriteria.type = enums.SearchType.PLAYER);

            _searchViewModel = this._viewmodel;

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
                    st = new UTGameFlowNavigationController,
                    p = new UTTabBarItemView,
                    _ = new UTTabBarItemView,
                    g = new UTTabBarItemView,
                    m = new UTTabBarItemView,
                    ST = new UTTabBarItemView,
                    S = new UTTabBarItemView;
                if (s.initWithRootController(new UTHomeHubViewController),
                    o.initWithRootController(new UTSquadsHubViewController),
                    l.initWithRootController(new UTTransfersHubViewController),
                    u.initWithRootController(new UTStoreViewController),
                    h.initWithRootController(new UTClubHubViewController),
                    st.initWithRootController(new UTCustomizeHubViewController),
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
                    ST.init(),
                    ST.setTag(UTGameTabBarController.TabTag.STADIUM),
                    ST.setText(services.Localization.localize("navbar.label.customizeHub")),
                    ST.addClass("icon-stadium"),
                    s.tabBarItem = p,
                    o.tabBarItem = _,
                    l.tabBarItem = g,
                    u.tabBarItem = m,
                    h.tabBarItem = S,
                    st.tabBarItem = ST,
                    t = [s, o, l, u, st, h],
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
                    this.presentViewController(i, !0, function () {
                        services.URL.hasDeepLinkURL() && services.URL.processDeepLinkURL()
                    }),
                    !0
            };

            getAppMain().getRootViewController().showGameView();
        } else {
            window.setTimeout(addTabItem, 1000);
        }
    };

    window.findMinBin = async function () {
        window.notify("Calculating price, please wait...", enums.UINotificationType.POSITIVE);

        jQuery('.ut-click-shield').addClass('showing');
        jQuery(".loaderIcon ").css("display", "block");

        let minBuy = await window.calcBin();

        if (minBuy) {
            window.notify("Succesfully computed the price", enums.UINotificationType.POSITIVE);
        }
        else {
            window.notify("Unable to calculate price", enums.UINotificationType.NEGATIVE);
        }

        jQuery(nameAbBuyPrice).val(minBuy + '');
        jQuery('.ut-click-shield').removeClass('showing');
        jQuery(".loaderIcon ").css("display", "none");
    }

    window.calcBin = async function () {
        let criteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;
        criteria.maxBuy = null;

        let allPrices = [];
        let itemsToConsider = 5;
        let isMinFound = false;
        let currentCount = 0;
        while (!isMinFound) {
            if (++currentCount === 10) {
                isMinFound = true;
            }
            else {
                sendPinEvents("Transfer Market Search");

                services.Item.clearTransferMarketCache();

                let items = await window.getBinSearchResult({...criteria});
                if (items.length) {

                    allPrices = allPrices.concat(items.map(i => i._auction.buyNowPrice));
                    const currentMin = Math.min(...items.map(i => i._auction.buyNowPrice));

                    if (items.length < 5) {
                        isMinFound = true;
                    }

                    let currentCalcBin = window.fixRandomPrice(window.getSellBidPrice(currentMin));

                    if (currentCalcBin === criteria.maxBuy) {
                        isMinFound = true;
                    } else {
                        criteria.maxBuy = window.fixRandomPrice(window.getSellBidPrice(currentMin));
                    }
                    await window.waitAsync(2);
                }
                else {
                    isMinFound = true;
                }
            }
        }
        allPrices = allPrices.sort((a, b) => a - b).slice(0, itemsToConsider);

        if (allPrices.length) {
            return window.fixRandomPrice(calcAverage(allPrices));
        }

        return null;
    }

    window.getBinSearchResult = function (criteria) {
        return new Promise((resolve, reject) => {
            services.Item.searchTransferMarket(criteria, 1).observe(
                this, (function (sender, response) {
                    if (response.success) {
                        sendPinEvents("Transfer Market Results - List View");
                        sendPinEvents("Item - Detail View");
                        resolve(response.data.items);
                    } else {
                        resolve([]);
                    }
                })
            );
        });
    }

    window.calcAverage = function (arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += parseInt(arr[i], 10);
        }

        return sum / arr.length;
    }

    window.createAutoBuyerInterface = function () {
        if (services.Localization && jQuery('h1.title').html() === services.Localization.localize("navbar.label.home")) {
            window.hasLoadedAll = true;
        }

        if (window.hasLoadedAll && getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._jsClassName) {
            if (!jQuery('.SearchWrapper').length) {
                var view = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._view;
                jQuery(view.__root.parentElement).prepend(
                    '<style>' +
                    '.ut-navigation-container-view--content>* { height: calc(100% - 4rem); }' +
                    '.ut-content-container .ut-content { max-height: none !important; }' +
                    '</style>' +
                    '<div id="' + nameInfoWrapper.substring(1) + '" class="ut-navigation-bar-view navbar-style-landscape">' +
                    '   <h1 class="title">AUTOBUYER STATUS: <span id="' + nameAbStatus.substring(1) + '"></span> | REQUEST COUNT: <span id="' + nameAbRequestCount.substring(1) + '">0</span></h1>' +
                    '   <div class="view-navbar-clubinfo">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <div class="view-navbar-clubinfo-name">' +
                    '               <div style="float: left;">Search:</div>' +
                    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
                    '                   <div id="' + nameAbSearchProgress.substring(1) + '" style="background: #000; height: 10px; width: 0%"></div>' +
                    '               </div>' +
                    '           </div>' +
                    '           <div class="view-navbar-clubinfo-name">' +
                    '               <div style="float: left;">Statistics:</div>' +
                    '               <div style="float: right; height: 10px; width: 100px; background: #888; margin: 5px 0px 5px 5px;">' +
                    '                   <div id="' + nameAbStatisticsProgress.substring(1) + '" style="background: #000; height: 10px; width: 0%"></div>' +
                    '               </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-currency" style="margin-left: 10px;">' +
                    '       <div class="view-navbar-currency-coins" id="' + nameAbCoins.substring(1) + '"></div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Sold Items: <span id="' + nameAbSoldItems.substring(1) + '"></span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Unsold Items: <span id="' + nameAbUnsoldItems.substring(1) + '"></span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div class="view-navbar-clubinfo" style="border: none;">' +
                    '       <div class="view-navbar-clubinfo-data">' +
                    '           <span class="view-navbar-clubinfo-name">Available Items: <span id="' + nameAbAvailableItems.substring(1) + '"></span></span>' +
                    '           <span class="view-navbar-clubinfo-name">Active transfers: <span id="' + nameAbActiveTransfers.substring(1) + '"></span></span>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>'
                );

                jQuery(view.__root.parentElement).append('<div id="' + nameSearchWrapper.substring(1) + '" style="width: 50%; right: 50%;"><textarea readonly id="' + nameProgressAutobuyer.substring(1) + '" style="font-size: 15px; width: 100%;height: 58%;background-color:#141414;color:#e2dde2;"></textarea><label>Search Results:</label><br/><textarea readonly id="' + nameAutoBuyerFoundLog.substring(1) + '" style="font-size: 10px; width: 100%;height: 37%;background-color:#141414;color:#e2dde2;"></textarea></div>');

                var $log = jQuery(nameProgressAutobuyer);
                if ($log.val() == '') {
                    let time_txt = '[' + new Date().toLocaleTimeString() + '] ';
                    let log_init_text = 'Autobuyer Ready\n' +
                        time_txt + '------------------------------------------------------------------------------------------\n' +
                        time_txt + ' Index  | Item name       | price  | op  | result  | comments\n' +
                        time_txt + '------------------------------------------------------------------------------------------\n';
                    $log.val(log_init_text)
                }

            }

            if (jQuery('.search-prices').first().length) {
                if (!jQuery(nameAbBuyPrice).length) {

                    jQuery('.ut-item-search-view').first().prepend(
                        '<div style="width:100%;display: flex;">' +
                        '<div class="button-container">' +
                        '<select id="' + nameFilterDropdown.substring(1) + '" name="filters" style="width:100%;padding: 10px;font-family: UltimateTeamCondensed,sans-serif;font-size: 1.6em;color: #e2dde2;text-transform: uppercase;background-color: #171826;"></select>' +
                        '</div>' +
                        '<div style="width:50%;margin-top: 1%;" class="button-container">' +
                        '<button style="width:50%" class="btn-standard call-to-action" id="' + nameDeleteFilter.substring(1) + '">Delete Filter</button>' +
                        '<button style="width:100%" class="btn-standard call-to-action" id="' + namePreserveChanges.substring(1) + '">Save Filter</button>' +
                        '</div> </div>');
                    jQuery('.search-prices').first().append(
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Buy/Bid Settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Buy Price:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbBuyPrice.substring(1) + '" placeholder="5000">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">No. of cards to buy:<br/><small>(Works only with Buy price)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbCardCount.substring(1) + '" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Bid Price:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbMaxBid.substring(1) + '" placeholder="5000">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Bid Exact Price</span>' +
                        '           <div id="' + nameAbBidExact.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Bid items expiring in:<br/><small>(S for seconds, M for Minutes, H for hours)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbItemExpiring.substring(1) + '" placeholder="1H">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '<div class="button-container">' +
                        '    <button class="btn-standard call-to-action" id="' + nameCalcBinPrice.substring(1) + '">Calculate Buy Price</button>' +
                        '</div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Sell settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Sell Price:</span><br/><small>Receive After Tax: <span id="' + nameSellAfterTax.substring(1) + '">0</span></small>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbSellPrice.substring(1) + '" placeholder="7000">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Clear sold count:<br/><small>(Clear sold items when reach a specified count)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbMinDeleteCount.substring(1) + '" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div style="padding-top : 20px" class="ut-toggle-cell-view">' +
                        '    <span class="ut-toggle-cell-view--label">Relist Unsold Items</span>' +
                        '    <div id="' + nameAbSellToggle.substring(1) + '" class="ut-toggle-control">' +
                        '        <div class="ut-toggle-control--track">' +
                        '        </div>' +
                        '        <div class= "ut-toggle-control--grip" >' +
                        '        </div>' +
                        '    </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Safety settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Wait Time:<br/><small>(Random second range eg. 7-15)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbWaitTime.substring(1) + '" placeholder="7-15">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max purchases per search request:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbMaxPurchases.substring(1) + '" placeholder="3">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Pause Cycle :<br/><small>(Number of searches performed before triggerring Pause)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbCycleAmount.substring(1) + '" placeholder="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Pause For:<br/><small>(S for seconds, M for Minutes, H for hours eg. 0-0S)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbPauseFor.substring(1) + '" placeholder="0-0S">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Stop After:<br/><small>(S for seconds, M for Minutes, H for hours)</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbStopAfter.substring(1) + '" placeholder="1H">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Add Delay After Buy<br/><small>(Adds 1 Sec Delay after trying <br/> to buy / bid a card)</small></span>' +
                        '           <div id="' + nameAbAddBuyDelay.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">SKIP GK<br/><small>(Skip all goalkeepers <br/> to buy / bid a card)</small></span>' +
                        '           <div id="' + nameAbAddFilterGK.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Rating Filtering:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Min Rating:<br/><small>Minimum Player Rating</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbMinRate.substring(1) + '" placeholder="10" value="10">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max Rating:<br/><small>Maximum Player Rating</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAbMaxRate.substring(1) + '" placeholder="100" value="100">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Search settings:</h1>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max value of random min bid:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbRandMinBidInput.substring(1) + '" placeholder="300">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Use random min bid</span>' +
                        '           <div id="' + nameAbRandMinBidToggle.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Max value of random min buy:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbRandMinBuyInput.substring(1) + '" placeholder="300">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Use random min buy</span>' +
                        '           <div id="' + nameAbRandMinBuyToggle.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Captcha settings:</h1>' +
                        '</div>' +

                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Close Web App on Captcha Trigger</span>' +
                        '           <div id="' + nameAbCloseTabToggle.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Auto Solve Captcha</span>' +
                        '           <div id="' + nameAbSolveCaptcha.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Anti-Captcha Key' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameAntiCaptchKey.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Proxy Address' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameProxyAddress.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Proxy Port' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameProxyPort.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Proxy User Name (Optional)' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameProxyLogin.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Proxy User Password (Optional)' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameProxyPassword.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +

                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Notification settings:</h1>' +
                        '</div>' +
                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Sound Notification</span>' +
                        '           <div id="' + nameAbSoundToggle.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Telegram Bot Token<br/><small>Token of your own bot</small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameTelegramBotToken.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Telegram Chat ID<br/><small>Your Telegram ChatID </small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameTelegramChatId.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Telegram Buy Notification<br/><small>Type A for buy/loss notification, B for buy only or L for lost notification only </small>:</span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="text" class="numericInput" id="' + nameTelegramBuy.substring(1) + '" style="text-transform: none;">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div style="width: 100%;" class="price-filter">' +
                        '   <div style="padding : 22px" class="ut-toggle-cell-view">' +
                        '       <span class="ut-toggle-cell-view--label">Send Notification</span>' +
                        '           <div id="' + nameAbMessageNotificationToggle.substring(1) + '" class="ut-toggle-control">' +
                        '           <div class="ut-toggle-control--track">' +
                        '           </div>' +
                        '           <div class= "ut-toggle-control--grip" >' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="button-container">' +
                        '    <button class="btn-standard call-to-action" id="' + nameTestNotification.substring(1) + '">Test Notification</button>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Multi-Filter settings:</h1>' +
                        '</div>' +
                        '<div class="button-container">' +
                        '       <select multiple="multiple" class="multiselect-filter" id="' + nameSelectedFilter.substring(1) + '" name="selectedFilters" style="padding: 10px;width: 100%;font-family: UltimateTeamCondensed,sans-serif;font-size: 1.6em;color: #e2dde2;text-transform: uppercase;background-color: #171826; overflow-y : scroll"></select>' +
                        '       <label style="white-space: nowrap;" id="' + nameSelectFilterCount.substring(1) + '">No Filter Selected</label>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Number of search For Filter:<br/><small>Count of searches to be performed before switching to different filter</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbNumberFilterSearch.substring(1) + '" placeholder="1">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<div><br></div>' +
                        '<hr>' +
                        '<div class="search-price-header">' +
                        '   <h1 class="secondary">Common settings:</h1>' +
                        '</div>' +
                        '<div class="price-filter">' +
                        '   <div class="info">' +
                        '       <span class="secondary label">Error Codes to stop bot (csv) :<br/><small>(Eg. 412,421,521)</small></span>' +
                        '   </div>' +
                        '   <div class="buttonInfo">' +
                        '       <div class="inputBox">' +
                        '           <input type="tel" class="numericInput" id="' + nameAbStopErrorCode.substring(1) + '" placeholder="">' +
                        '       </div>' +
                        '   </div>' +
                        '</div>' +
                        '<audio id="' + nameWinMp3.substring(1) + '" hidden">\n' +
                        '  <source src="https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.ogg" type="audio/ogg">\n' +
                        '  <source src="https://proxy.notificationsounds.com/notification-sounds/coins-497/download/file-sounds-869-coins.mp3" type="audio/mpeg">\n' +
                        '  Your browser does not support the audio element.\n' +
                        '</audio>' +
                        '<audio id="' + nameCapatchaMp3.substring(1) + '" hidden">\n' +
                        '  <source src="https://proxy.notificationsounds.com/wake-up-tones/alarm-frenzy-493/download/file-sounds-897-alarm-frenzy.ogg" type="audio/ogg">\n' +
                        '  <source src="https://proxy.notificationsounds.com/wake-up-tones/alarm-frenzy-493/download/file-sounds-897-alarm-frenzy.mp3" type="audio/mpeg">\n' +
                        '  Your browser does not support the audio element.\n' +
                        '</audio>'
                    );


                    let dropdown = $(nameFilterDropdown);
                    let filterdropdown = $(nameSelectedFilter);

                    dropdown.empty();
                    filterdropdown.empty();

                    dropdown.append('<option selected="true" disabled>Choose filter to load</option>');
                    dropdown.prop('selectedIndex', 0);

                    var filterArray = GM_listValues();
                    //console.log(filterArray);

                    // Populate dropdown with list of filters
                    for (var i = 0; i < filterArray.length; i++) {
                        dropdown.append($('<option></option>').attr('value', filterArray[i]).text(filterArray[i]));
                        filterdropdown.append($('<option></option>').attr('value', filterArray[i]).text(filterArray[i]));
                    }
                }
            }

            if (!jQuery(nameSearchCancelButton).length) {
                jQuery(nameInfoWrapper).next().find('.button-container button').last().after('<button class="btn-standard" id="' + nameSearchCancelButton.substring(1) + '">Stop</button><button class="btn-standard" id="' + nameClearLogButton.substring(1) + '">Clear Log</button>')
            }
        } else {
            window.setTimeout(createAutoBuyerInterface, 1000);
        }
    }

    window.saveDetails = function () {

        jQuery(namePreserveChanges).addClass("active");

        setTimeout(function () {

            let settingsJson = {};
            settingsJson.searchCriteria = { criteria: _searchViewModel.searchCriteria, playerData: _searchViewModel.playerData };

            settingsJson.abSettings = {};

            if (jQuery(nameAbBuyPrice).val() !== '') {
                settingsJson.abSettings.buyPrice = jQuery(nameAbBuyPrice).val();
            }

            if (jQuery(nameAbCardCount).val() !== '') {
                settingsJson.abSettings.cardCount = jQuery(nameAbCardCount).val();
            }

            if (jQuery(nameAbMaxBid).val() !== '') {
                settingsJson.abSettings.maxBid = jQuery(nameAbMaxBid).val();
            }

            if (jQuery(nameAbItemExpiring).val() !== '') {
                settingsJson.abSettings.itemExpiring = jQuery(nameAbItemExpiring).val();
            }

            if (window.bidExact) {
                settingsJson.abSettings.bidExact = window.bidExact;
            }

            if (jQuery(nameAbSellPrice).val() !== '') {
                settingsJson.abSettings.sellPrice = jQuery(nameAbSellPrice).val();
            }

            if (jQuery(nameAbMinDeleteCount).val() !== '') {
                settingsJson.abSettings.minDeleteCount = jQuery(nameAbMinDeleteCount).val();
            }

            if (window.reListEnabled) {
                settingsJson.abSettings.reListEnabled = window.reListEnabled;
            }

            if (jQuery(nameAbWaitTime).val() !== '') {
                settingsJson.abSettings.waitTime = jQuery(nameAbWaitTime).val();
            }

            if (jQuery(nameAbMaxPurchases).val() !== '') {
                settingsJson.abSettings.maxPurchases = jQuery(nameAbMaxPurchases).val();
            }

            if (jQuery(nameAbCycleAmount).val() !== '') {
                settingsJson.abSettings.pauseCycle = jQuery(nameAbCycleAmount).val();
            }

            if (jQuery(nameAbPauseFor).val() !== '') {
                settingsJson.abSettings.pauseFor = jQuery(nameAbPauseFor).val();
            }

            if (jQuery(nameAbStopAfter).val() !== '') {
                settingsJson.abSettings.stopAfter = jQuery(nameAbStopAfter).val();
            }

            if (jQuery(nameAbMinRate).val() !== '') {
                settingsJson.abSettings.minRate = jQuery(nameAbMinRate).val();
            }

            if (jQuery(nameAbMaxRate).val() !== '') {
                settingsJson.abSettings.maxRate = jQuery(nameAbMaxRate).val();
            }

            if (jQuery(nameAbRandMinBidInput).val() !== '') {
                settingsJson.abSettings.randMinBid = jQuery(nameAbRandMinBidInput).val();
            }

            if (jQuery(nameAbRandMinBuyInput).val() !== '') {
                settingsJson.abSettings.randMinBuy = jQuery(nameAbRandMinBuyInput).val();
            }

            if (window.useRandMinBuy) {
                settingsJson.abSettings.useRandMinBuy = window.useRandMinBuy;
            }

            if (window.useRandMinBid) {
                settingsJson.abSettings.useRandMinBid = window.useRandMinBid;
            }

            if (window.addDelayAfterBuy) {
                settingsJson.abSettings.addDelayAfterBuy = window.addDelayAfterBuy;
            }

            if(window.addFilterGK){
                settingsJson.abSettings.addFilterGK = window.addFilterGK;
            }

            if (jQuery(nameTelegramBotToken).val() !== '') {
                settingsJson.abSettings.telegramBotToken = jQuery(nameTelegramBotToken).val();
            }
            if (jQuery(nameTelegramChatId).val() !== '') {
                settingsJson.abSettings.telegramChatID = jQuery(nameTelegramChatId).val();
            }
            if (jQuery(nameTelegramBuy).val() !== '') {
                settingsJson.abSettings.telegramBuy = jQuery(nameTelegramBuy).val();
            }

            if (window.notificationEnabled) {
                settingsJson.abSettings.notificationEnabled = window.notificationEnabled;
            }
            if (window.soundEnabled) {
                settingsJson.abSettings.soundEnabled = window.soundEnabled;
            }

            if (window.captchaCloseTab) {
                settingsJson.abSettings.captchaCloseTab = window.captchaCloseTab;
            }

            if (window.autoSolveCaptcha) {
                settingsJson.abSettings.autoSolveCaptcha = window.autoSolveCaptcha;
            }

            if (jQuery(nameProxyAddress).val() !== '') {
                settingsJson.abSettings.proxyAddress = jQuery(nameProxyAddress).val();
            }
            if (jQuery(nameProxyPort).val() !== '') {
                settingsJson.abSettings.proxyPort = jQuery(nameProxyPort).val();
            }
            if (jQuery(nameProxyLogin).val() !== '') {
                settingsJson.abSettings.proxyUserName = jQuery(nameProxyLogin).val();
            }
            if (jQuery(nameProxyPassword).val() !== '') {
                settingsJson.abSettings.proxyUserPassword = jQuery(nameProxyPassword).val();
            }
            if (jQuery(nameAntiCaptchKey).val() !== '') {
                settingsJson.abSettings.antiCaptchKey = jQuery(nameAntiCaptchKey).val();
            }

            var currentFilterName = $('select[name=filters] option').filter(':selected').val();
            if (currentFilterName === 'Choose filter to load') {
                currentFilterName = undefined;
            }
            var filterName = prompt("Enter a name for this filter", currentFilterName);

            if (filterName) {
                filterName = filterName.toUpperCase();
                window.checkAndOption(nameFilterDropdown,filterName);
                window.checkAndOption(nameSelectedFilter,filterName);

                $(`select[name=filters] option[value="${filterName}"]`).attr("selected", true);
                GM_setValue(filterName, JSON.stringify(settingsJson));
                jQuery(namePreserveChanges).removeClass("active");
                window.notify("Changes saved successfully");
            } else {
                jQuery(namePreserveChanges).removeClass("active");
                window.notify("Filter Name Required", enums.UINotificationType.NEGATIVE);
            }
        }, 200);
    }

    window.checkAndOption = function(dropdownSelector, optionName){
        let exist = false;
        $(`${dropdownSelector} option`).each(function () {
            if (this.value === optionName) {
                exist = true;
                return false;
            }
        });

        if(!exist){
            $(dropdownSelector).append($('<option></option>').attr('value', optionName).text(optionName));
        }
    }

    window.clearABSettings = function (e) {
        $(nameAbBuyPrice).val('');
        $(nameAbCardCount).val('');
        $(nameAbMaxBid).val('');
        $(nameAbItemExpiring).val('');
        window.bidExact = false;
        jQuery(nameAbBidExact).removeClass("toggled");
        jQuery(nameAbSellPrice).val('');
        jQuery(nameAbMinDeleteCount).val('');
        window.reListEnabled = false;
        jQuery(nameAbSellToggle).removeClass("toggled");
        jQuery(nameAbWaitTime).val('');
        jQuery(nameAbMaxPurchases).val('');
        jQuery(nameAbCycleAmount).val('');
        jQuery(nameAbPauseFor).val('');
        jQuery(nameAbStopAfter).val('');
        jQuery(nameAbMinRate).val('');
        jQuery(nameAbMaxRate).val('');
        jQuery(nameAbRandMinBidInput).val('');
        jQuery(nameAbRandMinBuyInput).val('');
        jQuery(nameTelegramBotToken).val('');
        jQuery(nameTelegramChatId).val('');
        jQuery(nameTelegramBuy).val('');
        window.useRandMinBuy = false;
        window.useRandMinBid = false;
        window.addDelayAfterBuy = false;
        window.addFilterGK = false;
        jQuery(nameAbRandMinBuyToggle).removeClass("toggled");
        window.bidExact = false;
        jQuery(nameAbRandMinBidToggle).removeClass("toggled");
        window.captchaCloseTab = false;
        jQuery(nameAbCloseTabToggle).removeClass("toggled");
        window.notificationEnabled = false;
        jQuery(nameAbMessageNotificationToggle).removeClass("toggled");
        window.soundEnabled = false;
        jQuery(nameAbSoundToggle).removeClass("toggled");

        if (e) {
            jQuery(nameSelectedFilter).find('option').attr("selected", false);
            window.setFilters();
            jQuery(nameFilterDropdown).prop('selectedIndex', 0);
        }
    }

    jQuery(document).on('click', nameSearchCancelButton, deactivateAutoBuyer);
    jQuery(document).on('click', nameClearLogButton, clearLog);
    jQuery(document).on('click', 'button:contains("Reset")', clearABSettings);
    jQuery(document).on('click', nameCalcBinPrice, findMinBin);


    jQuery(document).on({
        mouseenter: function () {
            jQuery(namePreserveChanges).addClass("hover");
        },
        mouseleave: function () {
            jQuery(namePreserveChanges).removeClass("hover");
        },
        click: function () {
            saveDetails()
        }
    }, namePreserveChanges);

    jQuery(document).on({
        mouseenter: function () {
            jQuery(nameTestNotification).addClass("hover");
        },
        mouseleave: function () {
            jQuery(nameTestNotification).removeClass("hover");
        },
        click: function () {
            let bot_token = jQuery(nameTelegramBotToken).val();
            let bot_chatID = jQuery(nameTelegramChatId).val();
            let message = "Test Notification Arrived";
            if (bot_token && bot_chatID) {
                let url = 'https://api.telegram.org/bot' + bot_token +
                    '/sendMessage?chat_id=' + bot_chatID + '&parse_mode=Markdown&text=' + message;
                var xhttp = new XMLHttpRequest();
                xhttp.open("GET", url, true);
                xhttp.send();
            }
            window.notify("Test Notification Sent");
        }
    }, nameTestNotification);

    window.setFilters = function () {
        window.selectedFilters = $('select[name=selectedFilters]').val() || [];
        if (window.selectedFilters.length) {
            jQuery(nameSelectFilterCount).text('(' + window.selectedFilters.length + ') Filter Selected');
        } else {
            jQuery(nameSelectFilterCount).text('No Filter Selected');
        }
    }

    jQuery(document).on({
        mouseenter: function () {
            jQuery(nameDeleteFilter).addClass("hover");
        },
        mouseleave: function () {
            jQuery(nameDeleteFilter).removeClass("hover");
        },
        click: function () {
            deleteFilter()
        }
    }, nameDeleteFilter);

    jQuery(document).on({
        change: function () {
            loadFilter()
        }
    }, nameFilterDropdown);

    jQuery(document).on({
        click: function () {
            setFilters();
        },
    }, nameSelectedFilter);

    window.toggleBidExact = function () {
        if (window.bidExact) {
            window.bidExact = false;
            jQuery(nameAbBidExact).removeClass("toggled");
        } else {
            window.bidExact = true;
            jQuery(nameAbBidExact).addClass("toggled");
        }
    };

    window.toggleUseRandMinBid = function () {
        if (window.useRandMinBid) {
            window.useRandMinBid = false;
            jQuery(nameAbRandMinBidToggle).removeClass("toggled");
        } else {
            window.useRandMinBid = true;
            jQuery(nameAbRandMinBidToggle).addClass("toggled");
        }
    };

    window.toggleAddDelayAfterBuy = function () {
        if (window.addDelayAfterBuy) {
            window.addDelayAfterBuy = false;
            jQuery(nameAbAddBuyDelay).removeClass("toggled");
        } else {
            window.addDelayAfterBuy = true;
            jQuery(nameAbAddBuyDelay).addClass("toggled");
        }
    };

    window.toggleAddFilterGK = function () {
        if (window.addFilterGK) {
            window.addFilterGK = false;
            jQuery(nameAbAddFilterGK).removeClass("toggled");
        } else {
            window.addFilterGK = true;
            jQuery(nameAbAddFilterGK).addClass("toggled");
        }
    };

    window.toggleUseRandMinBuy = function () {
        if (window.useRandMinBuy) {
            window.useRandMinBuy = false;
            jQuery(nameAbRandMinBuyToggle).removeClass("toggled");
        } else {
            window.useRandMinBuy = true;
            jQuery(nameAbRandMinBuyToggle).addClass("toggled");
        }
    };

    window.toggleRelist = function () {
        if (window.reListEnabled) {
            window.reListEnabled = false;
            jQuery(nameAbSellToggle).removeClass("toggled");
        } else {
            alert("Re-listing will list all the cards in the transfer list not only the card which bought by the tool. " +
                "Check the transfer list once and move the required cards to your club to avoid losing any required cards.")

            window.reListEnabled = true;
            jQuery(nameAbSellToggle).addClass("toggled");
        }
    }

    window.toggleCloseTab = function () {
        if (window.captchaCloseTab) {
            window.captchaCloseTab = false;
            jQuery(nameAbCloseTabToggle).removeClass("toggled");
        } else {
            window.captchaCloseTab = true;
            jQuery(nameAbCloseTabToggle).addClass("toggled");
        }
    }

    window.toggleSolveCaptcha = function () {
        if (window.autoSolveCaptcha) {
            window.autoSolveCaptcha = false;
            jQuery(nameAbSolveCaptcha).removeClass("toggled");
        } else {
            window.autoSolveCaptcha = true;
            jQuery(nameAbSolveCaptcha).addClass("toggled");
        }
    }

    window.toggleSound = function () {
        if (window.soundEnabled) {
            window.soundEnabled = false;
            jQuery(nameAbSoundToggle).removeClass("toggled");
        } else {
            window.soundEnabled = true;
            jQuery(nameAbSoundToggle).addClass("toggled");
        }
    }

    window.toggleMessageNotification = function () {
        if (window.notificationEnabled) {
            window.notificationEnabled = false;
            jQuery(nameAbMessageNotificationToggle).removeClass("toggled");
        } else {
            window.notificationEnabled = true;
            jQuery(nameAbMessageNotificationToggle).addClass("toggled");
        }
    }


    jQuery(document).on('click', nameAbBidExact, toggleBidExact);
    jQuery(document).on('click', nameAbSellToggle, toggleRelist);

    jQuery(document).on('click', nameAbRandMinBidToggle, toggleUseRandMinBid);
    jQuery(document).on('click', nameAbAddBuyDelay, toggleAddDelayAfterBuy);
    jQuery(document).on('click', nameAbAddFilterGK, toggleAddFilterGK);
    jQuery(document).on('click', nameAbRandMinBuyToggle, toggleUseRandMinBuy);
    jQuery(document).on('click', nameAbCloseTabToggle, toggleCloseTab);
    jQuery(document).on('click', nameAbSoundToggle, toggleSound);
    jQuery(document).on('click', nameAbMessageNotificationToggle, toggleMessageNotification);
    jQuery(document).on('click', nameAbSolveCaptcha, toggleSolveCaptcha);


    jQuery(document).on('keyup', nameAbSellPrice, function () {
        jQuery(nameSellAfterTax).html((jQuery(nameAbSellPrice).val() - ((parseInt(jQuery(nameAbSellPrice).val()) / 100) * 5)).toLocaleString());
    });

    window.updateAutoTransferListStat = function () {
        if (!window.autoBuyerActive) {
            return;
        }

        sendPinEvents("Hub - Transfers");

        setTimeout(function () {
            window.updateTransferList();
        }, 300);
    };

    window.writeToLog = function (message) {
        let time_txt = '[' + new Date().toLocaleTimeString() + '] '
        var $log = jQuery(nameProgressAutobuyer);
        if ($log.val() == '') {
            let time_txt = '[' + new Date().toLocaleTimeString() + '] ';
            let log_init_text = 'Autobuyer Ready\n' +
                time_txt + '------------------------------------------------------------------------------------------\n' +
                time_txt + ' Index  | Item name                 | price  | op  | result  | comments\n' +
                time_txt + '------------------------------------------------------------------------------------------\n';
            $log.val(log_init_text)
        }
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.writeToDebugLog = function (message) {
        var $log = jQuery(nameAutoBuyerFoundLog);
        message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
        $log.val($log.val() + message);
        $log.scrollTop($log[0].scrollHeight);
    };

    window.notify = function (message, notificationType) {
        notificationType = notificationType || enums.UINotificationType.POSITIVE;
        services.Notification.queue([message, notificationType])
    };

    window.getRandomWait = function () {
        var addedTime = 0;

        var wait = [7, 15];
        if (jQuery(nameAbWaitTime).val()) {
            wait = jQuery(nameAbWaitTime).val().split('-').map(a => parseInt(a));
        }
        window.searchCount++;
        return (Math.round((Math.random() * (wait[1] - wait[0]) + wait[0])) * 1000);
    };

    window.getTimerProgress = function (timer) {
        var time = (new Date()).getTime();

        return (Math.max(0, timer.finish - time) / (timer.finish - timer.start)) * 100;
    };

    window.updateStatistics = function () {
        jQuery(nameAbSearchProgress).css('width', window.getTimerProgress(window.timers.search));
        jQuery(nameAbStatisticsProgress).css('width', window.getTimerProgress(window.timers.transferList));

        jQuery(nameAbRequestCount).html(window.searchCount);

        jQuery(nameAbCoins).html(window.futStatistics.coins);

        if (window.autoBuyerActive) {
            jQuery(nameAbStatus).css('color', '#2cbe2d').html('RUNNING');
        } else {
            jQuery(nameAbStatus).css('color', 'red').html('IDLE');
        }

        jQuery(nameAbSoldItems).html(window.futStatistics.soldItems);
        jQuery(nameAbUnsoldItems).html(window.futStatistics.unsoldItems);
        jQuery(nameAbAvailableItems).html(window.futStatistics.availableItems);
        jQuery(nameAbActiveTransfers).html(window.futStatistics.activeTransfers);

        if (window.futStatistics.unsoldItems) {
            jQuery(nameAbUnsoldItems).css('color', 'red');
        } else {
            jQuery(nameAbUnsoldItems).css('color', '');
        }

        if (window.futStatistics.availableItems) {
            jQuery(nameAbAvailableItems).css('color', 'orange');
        } else {
            jQuery(nameAbAvailableItems).css('color', '');
        }
    };


    window.hasLoadedAll = false;
    window.searchCount = 0;
    createAutoBuyerInterface();
    addTabItem();

    window.getMaxSearchBid = function (min, max) {
        return Math.round((Math.random() * (max - min) + min) / 1000) * 1000;
    };

    window.getRandNum = function (min, max) {
        return Math.round((Math.random() * (max - min) + min));
    };
    window.getItemName = function (itemObj) {
        return window.format_string(itemObj._staticData.name, 15);
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

    window.errorCodeLookUpShort = {
        '521': 'Rejected',
        '512': 'Rejected',
        '429': 'Too many requests',
        '426': 'Others won card/bid',
        '461': 'Others won card/bid',
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

            if (!window.isSearchInProgress && (window.timers.search.finish == 0 || window.timers.search.finish <= time)) {

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

            if (!window.selectedFilters.length && (window.timers.bidCheck.finish == 0 || window.timers.bidCheck.finish <= time)) {
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
        if ($(nameAbStopAfter).val()) {
            stopAfter = $(nameAbStopAfter).val();
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
            var pauseFor = "0-0S";
            if ($(nameAbPauseFor).val()) {
                pauseFor = $(nameAbPauseFor).val();
            }
            let interval = pauseFor[pauseFor.length - 1].toUpperCase();
            let time = pauseFor.substring(0, pauseFor.length - 1);

            var waitTime = [0, 0];
            if (time) {
                waitTime = time.split('-').map(a => parseInt(a));
            }
            time = Math.round((Math.random() * (waitTime[1] - waitTime[0]) + waitTime[0]));

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
    };

    window.searchFutMarket = function (sender, event, data) {
        if (!window.autoBuyerActive) {
            return;
        }

        let isSeachEventDone = false;
        window.isSearchInProgress = true;

        if (window.selectedFilters && window.selectedFilters.length && !window.eachFilterSearch) {

            let filterName = window.selectedFilters[window.getRandNum(0, window.selectedFilters.length - 1)];
            window.loadFilterByName(filterName);
            isSeachEventDone = true;
            window.currentPage = 1;
            writeToDebugLog('---------------------------  Running for filter ' + filterName + '  ---------------------------------------------');
        }

        if (!window.eachFilterSearch) {
            if (jQuery(nameAbNumberFilterSearch).val() !== '') {
                window.eachFilterSearch = parseInt(jQuery(nameAbNumberFilterSearch).val());
            }
            else {
                window.eachFilterSearch = 1
            }
        }

        window.eachFilterSearch--;

        var searchCriteria = getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController()._viewmodel.searchCriteria;

        services.Item.clearTransferMarketCache();

        var expiresIn = 3600;
        if ($(nameAbItemExpiring).val() !== '') {
            var expiresInString = "1H";
            if ($(nameAbItemExpiring).val()) {
                expiresInString = $(nameAbItemExpiring).val();
            }
            let expiresInterval = expiresInString[expiresInString.length - 1].toUpperCase();
            let expiresInTime = parseInt(expiresInString.substring(0, expiresInString.length - 1));

            let multipler = (expiresInterval === "M") ? 60 : ((expiresInterval === "H") ? 3600 : 1)
            if (expiresInTime) {
                expiresIn = expiresInTime * multipler;
            }
        }

        // Randomize search criteria min bid to clear cache
        if (window.useRandMinBid) {
            let user_min_bid_txt = $(nameAbRandMinBidInput).val();
            if (user_min_bid_txt == '') { user_min_bid_txt = '300' }
            let user_min_bid = Math.round(parseInt(user_min_bid_txt));
            searchCriteria.minBid = window.fixRandomPrice(window.getRandNum(0, user_min_bid));
            window.currentPage = 1;
        }
        if (window.useRandMinBuy) {
            let user_min_buy_txt = $(nameAbRandMinBuyInput).val();
            if (user_min_buy_txt == '') { user_min_buy_txt = '300' }
            let user_min_buy = Math.round(parseInt(user_min_buy_txt));
            searchCriteria.minBuy = window.fixRandomPrice(window.getRandNum(0, user_min_buy));
            window.currentPage = 1;
        }

        if (!isSeachEventDone && window.currentPage === 1) {
            sendPinEvents("Transfer Market Search");
        }

        window.mbid = searchCriteria.minBid;
        window.mBuy = searchCriteria.minBuy;

        if ($(nameAbCardCount).val() !== '') {
            window.buyCardCount = parseInt(jQuery(nameAbCardCount).val());
        } else {
            window.buyCardCount = undefined;
        }

        services.Item.searchTransferMarket(searchCriteria, window.currentPage).observe(this, (function (sender, response) {
            if (response.success && window.autoBuyerActive) {
                (window.currentPage === 1) && sendPinEvents("Transfer Market Results - List View");
                window.searchCountBeforePause--;

                let min_rate_txt = jQuery(nameAbMinRate).val();
                let max_rate_txt = jQuery(nameAbMaxRate).val();
                if (min_rate_txt == '') {
                    min_rate_txt = "10"
                }
                if (max_rate_txt == '') {
                    max_rate_txt = "100"
                }
                let selected_min_rate = parseInt(min_rate_txt);
                let selected_max_rate = parseInt(max_rate_txt);

                writeToDebugLog('= Received ' + response.data.items.length + ' items - from page (' + window.currentPage + ')  =>  config: (minbid:' + window.mbid + '-minbuy:' + window.mBuy + ') ');

                var maxPurchases = 3;
                if ($(nameAbMaxPurchases).val() !== '') {
                    maxPurchases = Math.max(1, parseInt($(nameAbMaxPurchases).val()));
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
                if (response.data.items.length > 0) {
                    writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                    writeToDebugLog('| rating   | player name     | bid    | buy    | time            | action');
                    writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                    (window.currentPage === 1) && sendPinEvents("Item - Detail View");
                    window.firstSearch = true;
                } else {
                    window.isSearchInProgress = false;
                }

                for (let i = 0; i < response.data.items.length; i++) {
                    let action_txt = 'none';
                    let player = response.data.items[i];
                    let auction = player._auction;
                    let player_rating = parseInt(player.rating);

                    let expires = services.Localization.localizeAuctionTimeRemaining(auction.expires);

                    let buyNowPrice = auction.buyNowPrice;
                    let currentBid = auction.currentBid || auction.startingBid;
                    let isBid = auction.currentBid;
                    let bidPrice = parseInt(jQuery(nameAbMaxBid).val());


                    let priceToBid = (window.bidExact) ? bidPrice : ((isBid) ? window.getSellBidPrice(bidPrice) : bidPrice);
                    let checkPrice = (window.bidExact) ? priceToBid : ((isBid) ? window.getBuyBidPrice(currentBid) : currentBid);
                    let userBuyNowPrice = parseInt(jQuery(nameAbBuyPrice).val());

                    var sellPrice = parseInt(jQuery(nameAbSellPrice).val());

                    let bid_buy_txt = "(bid: " + window.format_string(currentBid.toString(), 6) + " / buy:" + window.format_string(buyNowPrice.toString(), 7) + ")"
                    let player_name = window.getItemName(player);
                    let expire_time = window.format_string(expires, 15);
                    let bid_txt = window.format_string(currentBid.toString(), 6)
                    let buy_txt = window.format_string(buyNowPrice.toString(), 6)

                    let rating_ok = false;

                    let rating_ok_txt = "no";
                    if (player_rating >= selected_min_rate && player_rating <= selected_max_rate) {
                        rating_ok = true;
                        rating_ok_txt = "ok";
                    }
                    let rating_txt = "(" + player_rating + "-" + rating_ok_txt + ") ";

                    // ============================================================================================================
                    // checking reasons to skip
                    // ============================================================================================================
                    if (isNaN(userBuyNowPrice) && isNaN(priceToBid)) {
                        action_txt = 'skip >>> (No action required)';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }

                    if (!rating_ok) {
                        action_txt = 'skip >>> (rating does not fit criteria)';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }
                    if (maxPurchases < 1) {
                        action_txt = 'skip >>> (Exceeded num of buys/bids per search)';
                        let player_name = window.getItemName(player);
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }
                    // ============================================================================================================

                    if(player.preferredPosition == 0 && window.addFilterGK == true){
                        action_txt = 'skip >>> (is a Goalkeeper)';
                        let player_name = window.getItemName(player);
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        continue;
                    }

                    if (rating_ok && window.autoBuyerActive && buyNowPrice <= userBuyNowPrice && buyNowPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId)) {
                        action_txt = 'attempt buy: ' + buy_txt;
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        buyPlayer(player, buyNowPrice, sellPrice, true);
                        window.addDelayAfterBuy && window.waitSync(1);
                        maxPurchases--;
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    } else if (rating_ok && window.autoBuyerActive && bidPrice && currentBid <= priceToBid && checkPrice <= window.futStatistics.coinsNumber && !window.bids.includes(auction.tradeId)) {

                        if (auction.expires > expiresIn) {
                            action_txt = 'skip >>> (Waiting for specified expiry time)';
                            writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                            continue;
                        }

                        action_txt = 'attempt bid: ' + bidPrice;
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                        buyPlayer(player, checkPrice, sellPrice);
                        window.addDelayAfterBuy && window.waitSync(1);
                        maxPurchases--;
                        //setTimeout(function (){}, 1000);
                        if (!window.bids.includes(auction.tradeId)) {
                            window.bids.push(auction.tradeId);

                            if (window.bids.length > 300) {
                                window.bids.shift();
                            }
                        }
                    } else {
                        if (buyNowPrice > userBuyNowPrice || currentBid > priceToBid) {
                            action_txt = 'skip >>> (higher than specified buy/bid price)';
                            writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                            continue;
                        }
                        if (buyNowPrice > window.futStatistics.coinsNumber) {
                            action_txt = 'skip >>> (Insufficient coins)';
                            writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                            continue;
                        }

                        action_txt = 'skip >>> (Cached Item)';
                        writeToDebugLog("| " + rating_txt + ' | ' + player_name + ' | ' + bid_txt + ' | ' + buy_txt + ' | ' + expire_time + ' | ' + action_txt);
                    }
                    window.firstSearch = false;
                }
                if (response.data.items.length > 0) {
                    writeToDebugLog('----------------------------------------------------------------------------------------------------------------------');
                    window.isSearchInProgress = false;
                }
            } else if (!response.success) {
                if (response.status == HttpStatusCode.CAPTCHA_REQUIRED) {
                    if (window.autoSolveCaptcha) {
                        writeToLog('------------------------------------------------------------------------------------------');
                        writeToLog('[!!!] Captcha got triggered, trying to solve it');
                        writeToLog('------------------------------------------------------------------------------------------');
                        window.solveCaptcha();
                    }
                    else {
                        window.showCaptchaLogs();
                    }
                } else {
                    writeToLog('------------------------------------------------------------------------------------------');
                    writeToLog('[!!!] Autostopping bot as search failed, please check if you can access transfer market in Web App');
                    writeToLog('------------------------------------------------------------------------------------------');
                }
                window.play_audio('capatcha');
                window.deactivateAutoBuyer(true);
                window.isSearchInProgress = false;
            }
        }));
    };

    window.showCaptchaLogs = function() {

        window.sendNotificationToUser('Captcha, please solve the problem so that the bot can work again.');

        if (window.captchaCloseTab) {
            window.location.href = "about:blank";
            return;
        }
        writeToLog('------------------------------------------------------------------------------------------');
        writeToLog('[!!!] Autostopping bot since Captcha got triggered');
        writeToLog('------------------------------------------------------------------------------------------');
    }

    window.solveCaptcha = function () {
        var apikey = jQuery(nameAntiCaptchKey).val();
        var websiteURL = "https://www.ea.com/fifa/ultimate-team/web-app/";
        var websitePublicKey = "A4EECF77-AC87-8C8D-5754-BF882F72063B";

        var proxyAddress = jQuery(nameProxyAddress).val();
        var proxyPort =jQuery(nameProxyPort).val();
        var proxyLogin = jQuery(nameProxyLogin).val();
        var proxyPassword = jQuery(nameProxyPassword).val();

        if(!proxyAddress || !proxyPort || !apikey){
            writeToLog('Proxy info not filled properly');
            window.showCaptchaLogs();
            return;
        }

        function createTask() {
            accessobjects.Captcha.getCaptchaData().observe(this, (function (sender, responseData) {
                if (responseData.success) {

                    var data = responseData.response.blob;
                    if (!data) {
                        return false;
                    }

                    let payload = {
                        "clientKey": apikey,
                        "task":
                            {
                                "type": "FunCaptchaTask",
                                "websiteURL": websiteURL,
                                "websitePublicKey": websitePublicKey,
                                "funcaptchaApiJSSubdomain": "ea-api.arkoselabs.com",
                                "data": responseData.response,
                                "proxyType": "http",
                                "proxyAddress": proxyAddress,
                                "proxyPort": proxyPort,
                                "proxyLogin": proxyLogin,
                                "proxyPassword": proxyPassword,
                                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
                            }
                    };

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", 'https://api.anti-captcha.com/createTask', true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var json = JSON.parse(xhr.responseText);
                            if (json.errorId == 0) {
                                getTaskResult(json.taskId);
                            } else {
                                writeToLog('Got error from Captcha API: ' + json.errorCode + ', ' + json.errorDescription);
                            }
                        }
                    };
                    var data = JSON.stringify(payload);
                    xhr.send(data);
                    return true;
                }
            }));
        }

        function getTaskResult(taskId) {
            let payload = {
                'clientKey': apikey,
                'taskId': taskId
            };
            var xhr = new XMLHttpRequest();
            xhr.open("POST", 'https://api.anti-captcha.com/getTaskResult', true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    if (json.errorId == 0) { //no errors
                        if (json.status == 'ready') {
                            let captchaModel = new UTCaptchaViewModel(accessobjects.Captcha);
                            captchaModel.validateToken(json.solution.token).observe(this, (function (sender, response) {
                                if (response.success) {
                                    writeToLog("Captcha Solved");
                                    window.activateAutoBuyer(true);
                                }
                            }));
                        } else {
                            setTimeout(() => getTaskResult(taskId), 1000);
                        }
                    } else {
                        writeToLog('Error occured when checking captcha result : ' + json.errorCode + ', ' + json.errorDescription);
                    }
                }
            };
            var data = JSON.stringify(payload);
            xhr.send(data);
        }

        createTask();
    }

    window.fixRandomPrice = function (price) {
        let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
            return price >= e.min
        });
        var nearestPrice = Math.round(price / range.inc) * range.inc;
        return Math.max(Math.min(nearestPrice, 14999000), 0);
    }

    window.watchBidItems = function () {

        services.Item.clearTransferMarketCache();

        services.Item.requestWatchedItems().observe(this, function (t, response) {

            var bidPrice = parseInt(jQuery(nameAbMaxBid).val());

            var sellPrice = parseInt(jQuery(nameAbSellPrice).val());

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
                                buyPlayer(player, checkPrice, sellPrice);
                                window.addDelayAfterBuy && window.waitSync(1);
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
                            return item.getAuctionData().isWon() && !window.userWatchItems.includes(item._auction.tradeId) && !window.sellBids.includes(item._auction.tradeId);
                        });

                        for (var i = 0; i < boughtItems.length; i++) {
                            let player = boughtItems[i];
                            let auction = player._auction;

                            window.sellBids.push(auction.tradeId);
                            let player_name = window.getItemName(player);
                            writeToLog(" ($$$) " + player_name + '[' + player._auction.tradeId + '] -- Selling for: ' + sellPrice);
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

    window.buyPlayer = function (player, price, sellPrice, isBin) {
        services.Item.bid(player, price).observe(this, (function (sender, data) {
            let price_txt = window.format_string(price.toString(), 6)
            let player_name = window.getItemName(player);
            if (data.success) {

                if (isBin) {
                    window.purchasedCardCount++;
                }

                if (isBin && sellPrice !== 0 && !isNaN(sellPrice)) {
                    window.winCount++;
                    let sym = " W:" + window.format_string(window.winCount.toString(), 4);
                    writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | selling for: ' + sellPrice : ' | bid | success |' + ' selling for: ' + sellPrice));
                    window.play_audio('card_won');
                    window.sellRequestTimeout = window.setTimeout(function () {
                        services.Item.list(player, window.getSellBidPrice(sellPrice), sellPrice, 3600);
                    }, window.getRandomWait());
                } else {
                    window.bidCount++;
                    services.Item.move(player, enums.FUTItemPile.CLUB).observe(this, (function (sender, moveResponse) {
                        let sym = " B:" + window.format_string(window.bidCount.toString(), 4);
                        writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | success | move to club' : ' | bid | success | waiting to expire'));
                    }));
                }

                if (jQuery(nameTelegramBuy).val() == 'B' || jQuery(nameTelegramBuy).val() == 'A') {
                    window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + ' | buy |');
                }

            } else {
                window.lossCount++;
                let sym = " L:" + window.format_string(window.lossCount.toString(), 4);
                writeToLog(sym + " | " + player_name + ' | ' + price_txt + ((isBin) ? ' | buy | failure |' : ' | bid | failure |') + ' ERR: ' + data.status + '-' + (errorCodeLookUpShort[data.status] || ''));
                if (jQuery(nameTelegramBuy).val() == 'L' || jQuery(nameTelegramBuy).val() == 'A') {
                    window.sendNotificationToUser("| " + player_name.trim() + ' | ' + price_txt.trim() + ' | failure |');
                }

                if (jQuery(nameAbStopErrorCode).val()) {
                    var errorCodes = jQuery(nameAbStopErrorCode).val().split(",");

                    if (errorCodes.indexOf(data.status + "") != -1) {
                        writeToLog('------------------------------------------------------------------------------------------');
                        writeToLog(`[!!!] Autostopping bot since error code ${data.status} has occured`);
                        writeToLog('------------------------------------------------------------------------------------------');
                        window.deactivateAutoBuyer(true);
                    }
                }
            }
            window.isSearchInProgress = false;
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
        sendPinEvents("Transfer List - List View");
        services.Item.requestTransferItems().observe(this, function (t, response) {
            let sendEvent = true;
            let soldItems = response.data.items.filter(function (item) {
                return item.getAuctionData().isSold();
            });

            window.futStatistics.soldItems = soldItems.length;

            if (sendEvent && window.futStatistics.soldItems) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            window.futStatistics.unsoldItems = response.data.items.filter(function (item) {
                return !item.getAuctionData().isSold() && item.getAuctionData().isExpired();
            }).length;


            if (sendEvent && window.futStatistics.unsoldItems) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            if (window.futStatistics.unsoldItems && window.reListEnabled) {
                services.Item.relistExpiredAuctions().observe(this, function (t, response) {
                });
            }

            window.futStatistics.activeTransfers = response.data.items.filter(function (item) {
                return item.getAuctionData().isSelling();
            }).length;

            if (sendEvent && window.futStatistics.activeTransfers) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            window.futStatistics.availableItems = response.data.items.filter(function (item) {
                return item.getAuctionData().isInactive();
            }).length;

            if (sendEvent && window.futStatistics.availableItems) {
                sendPinEvents("Item - Detail View");
                sendEvent = false;
            }

            var minSoldCount = 10;
            if ($(nameAbMinDeleteCount).val() !== '') {
                minSoldCount = Math.max(1, parseInt($(nameAbMinDeleteCount).val()));
            }

            if (window.futStatistics.soldItems >= minSoldCount) {
                writeToLog('------------------------------------------------------------------------------------------');
                writeToLog('[TRANSFER-LIST] > ' + window.futStatistics.soldItems + " item(s) sold");
                writeToLog('------------------------------------------------------------------------------------------');
                window.clearSoldItems();
            }

            sendPinEvents("Hub - Transfers");
        });
    };

    window.waitSync = function (seconds = 1) {

        var isDone = false;
        var start = new Date().getTime();
        var msToWait = seconds * 1000;

        do {
            var now = new Date().getTime();
            var delta = now - start;

            if (delta >= msToWait) {
                isDone = true;
            }
        }

        while (!isDone)
        return;
    }

    window.waitAsync = async function (seconds = 1) {
        await new Promise(resolve => setTimeout(resolve, seconds * 1000))
    }

    window.clearSoldItems = function () {
        services.Item.clearSoldItems().observe(this, function (t, response) {
        });
    }
})();

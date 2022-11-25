// ==UserScript==
// @name userscript-typescript-template
// @version 1.1.0
// @namespace http://tampermonkey.net/
// @description Template repo using Webpack and TypeScript to build your userscript for Tampermonkey and more extensions.
// @homepage https://github.com/pboymt/userscript-typescript-template#readme
// @match https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match https://www.ea.com/fifa/ultimate-team/web-app/*
// @require https://cdn.jsdelivr.net/npm/$axios@$0.27.2
// @require https://code.jquery.com/jquery-3.6.1.min.js
// @require https://raw.githubusercontent.com/ckalgos/FUT-Auto-Buyer/main/external/discord.11.4.2.min.js
// @require https://greasyfork.org/scripts/47911-font-awesome-all-js/code/Font-awesome%20AllJs.js?version=275337
// @connect ea.com
// @connect ea2.com
// @connect futbin.com
// @connect futwiz.com
// @connect discordapp.com
// @connect futbin.org
// @connect exp.host
// @connect on.aws
// @grant GM_xmlhttpRequest
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.initializeOverrides = void 0;
const sidebar_override_1 = __webpack_require__(2);
const style_override_1 = __webpack_require__(50);
const topnavbarOverride_1 = __webpack_require__(51);
const initializeOverrides = () => {
    (0, sidebar_override_1.sideBarOverride)();
    (0, style_override_1.styleOverride)();
    isPhone() && (0, topnavbarOverride_1.topNavBarOverride)();
};
exports.initializeOverrides = initializeOverrides;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sideBarOverride = void 0;
const Autobuyer_controller_1 = __webpack_require__(3);
const sideBarOverride = () => {
    const navViewInit = UTGameTabBarController.prototype.initWithViewControllers;
    UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
        const autoBuyerNav = new UTGameFlowNavigationController();
        autoBuyerNav.initWithRootController(new Autobuyer_controller_1.AutoBuyerController());
        autoBuyerNav.tabBarItem = generateAutoBuyerTab("Autobuyer");
        tabs = getApplicableTabs(tabs);
        tabs.push(autoBuyerNav);
        navViewInit.call(this, tabs);
    };
};
exports.sideBarOverride = sideBarOverride;
const getApplicableTabs = (tabs) => {
    if (!isPhone()) {
        return tabs;
    }
    const updatedTabs = [];
    updatedTabs.push(tabs[0]);
    updatedTabs.push(tabs[2]);
    updatedTabs.push(tabs[3]);
    updatedTabs.push(tabs[4]);
    return updatedTabs;
};
const generateAutoBuyerTab = (title) => {
    const autoBuyerTab = new UTTabBarItemView();
    autoBuyerTab.init();
    autoBuyerTab.setTag(8);
    autoBuyerTab.setText(title);
    autoBuyerTab.addClass("icon-transfer");
    return autoBuyerTab;
};


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoBuyerController = void 0;
const Logger_1 = __webpack_require__(4);
const MenuItem_1 = __webpack_require__(7);
const AutobuyerProcessor_1 = __webpack_require__(14);
const dom_util_1 = __webpack_require__(6);
const createButton_1 = __webpack_require__(48);
const LogView_1 = __webpack_require__(49);
class AutoBuyerController extends UTMarketSearchFiltersViewController {
    init() {
        var _a, _b;
        super.init();
        const view = this.getView();
        const viewRoot = view.getRootElement();
        if (!isPhone())
            viewRoot.setAttribute("style", "width: 52%; float: left;");
        viewRoot.id = "autobuyer";
        const autoBuyerInstance = AutobuyerProcessor_1.AutoBuyerProcessor.getInstance();
        autoBuyerInstance.setControllerInstance(this);
        const createButtonWithContext = createButton_1.createButton.bind(this);
        const stopBtn = createButtonWithContext("Stop", () => {
            autoBuyerInstance.stop();
        });
        const searchBtn = createButtonWithContext("Start", () => __awaiter(this, void 0, void 0, function* () {
            autoBuyerInstance.start();
        }), "call-to-action");
        const btnContainer = (0, dom_util_1.find)(".button-container", viewRoot);
        if (!btnContainer) {
            return;
        }
        (_a = (0, dom_util_1.find)(".call-to-action", btnContainer)) === null || _a === void 0 ? void 0 : _a.remove();
        (0, dom_util_1.append)(btnContainer, searchBtn.getRootElement());
        (0, dom_util_1.append)(btnContainer, stopBtn.getRootElement());
        if (!isPhone()) {
            const clearLogBtn = createButtonWithContext("Clear Log", () => Logger_1.Logger.clear());
            (0, dom_util_1.append)(btnContainer, clearLogBtn.getRootElement());
        }
        const menuItem = new MenuItem_1.MenuItem();
        (_b = (0, dom_util_1.find)(".search-prices", viewRoot)) === null || _b === void 0 ? void 0 : _b.append(menuItem.getView());
    }
    viewDidAppear() {
        this.getNavigationController().setNavigationVisibility(true, true);
        super.viewDidAppear();
    }
    getNavigationTitle() {
        setTimeout(() => {
            const title = (0, dom_util_1.find)(".title");
            title === null || title === void 0 ? void 0 : title.classList.add("autobuyer-title");
            const rootElement = this.getParentViewController()
                .getView()
                .getRootElement();
            const navigationContent = (0, dom_util_1.find)(".ut-navigation-container-view--content", rootElement);
            navigationContent && (0, dom_util_1.append)(navigationContent, (0, LogView_1.logView)());
        });
        return "autoBuyer";
    }
}
exports.AutoBuyerController = AutoBuyerController;
JSUtils.inherits(AutoBuyerController, UTMarketSearchFiltersViewController);


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const enums_1 = __webpack_require__(5);
const dom_util_1 = __webpack_require__(6);
class Logger {
    static writeToLog(message, messageType = enums_1.UINotificationTypeEnum.NEUTRAL) {
        setTimeout(() => {
            const log = (0, dom_util_1.find)(".autoBuyerLog");
            message = "[" + new Date().toLocaleTimeString() + "] " + message + "\n";
            if (log) {
                log.append((0, dom_util_1.htmlToElement)(`<div style='color:${this.getColorByType(messageType)}'>${message}</div>`));
                log.scrollTop = log.scrollHeight;
            }
        }, 50);
    }
    static clear() {
        const log = (0, dom_util_1.find)(".autoBuyerLog");
        log && (log.textContent = "");
    }
    static getColorByType(messageType) {
        if (messageType === enums_1.UINotificationTypeEnum.POSITIVE) {
            return "#36b84b";
        }
        else if (messageType === enums_1.UINotificationTypeEnum.NEGATIVE) {
            return "#d31332";
        }
        return "#f2f2f2";
    }
}
exports.Logger = Logger;
_a = Logger;
(() => {
    _a.writeToLog("Autobuyer Ready");
})();


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UINotificationTypeEnum = exports.UTItemPile = exports.EventTypeEnum = void 0;
var EventTypeEnum;
(function (EventTypeEnum) {
    EventTypeEnum["TAP"] = "TAP";
    EventTypeEnum["CHANGE"] = "CHANGE";
})(EventTypeEnum = exports.EventTypeEnum || (exports.EventTypeEnum = {}));
var UTItemPile;
(function (UTItemPile) {
    UTItemPile[UTItemPile["ANY"] = 0] = "ANY";
    UTItemPile[UTItemPile["CLUB"] = 7] = "CLUB";
    UTItemPile[UTItemPile["GIFT"] = 9] = "GIFT";
    UTItemPile[UTItemPile["INBOX"] = 8] = "INBOX";
    UTItemPile[UTItemPile["PURCHASED"] = 6] = "PURCHASED";
    UTItemPile[UTItemPile["TRANSFER"] = 5] = "TRANSFER";
})(UTItemPile = exports.UTItemPile || (exports.UTItemPile = {}));
var UINotificationTypeEnum;
(function (UINotificationTypeEnum) {
    UINotificationTypeEnum[UINotificationTypeEnum["NEGATIVE"] = 2] = "NEGATIVE";
    UINotificationTypeEnum[UINotificationTypeEnum["NEUTRAL"] = 1] = "NEUTRAL";
    UINotificationTypeEnum[UINotificationTypeEnum["POSITIVE"] = 0] = "POSITIVE";
})(UINotificationTypeEnum = exports.UINotificationTypeEnum || (exports.UINotificationTypeEnum = {}));


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.waitForElement = exports.waitForElementToDisplay = exports.isHidden = exports.isVisible = exports.htmlToElement = exports.appendSibling = exports.append = exports.findByText = exports.findElementAtIndex = exports.find = void 0;
function find(query, parent = document) {
    return parent.querySelector(query);
}
exports.find = find;
function findElementAtIndex(query, index = 0, parent = document) {
    return parent.querySelectorAll(query)[index];
}
exports.findElementAtIndex = findElementAtIndex;
function findByText(query, text) {
    var elements = document.querySelectorAll(query);
    return Array.prototype.find.call(elements, function (element) {
        return RegExp(text).test(element.textContent);
    });
}
exports.findByText = findByText;
function append(parent, child) {
    parent.appendChild(child);
    return parent;
}
exports.append = append;
function appendSibling(sibling, newElement) {
    sibling.insertAdjacentHTML("afterend", newElement.innerHTML);
    return sibling;
}
exports.appendSibling = appendSibling;
function htmlToElement(html) {
    var template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}
exports.htmlToElement = htmlToElement;
function isVisible(element) {
    return !isHidden(element);
}
exports.isVisible = isVisible;
function isHidden(element) {
    if (!element)
        return true;
    return !element.offsetWidth && !element.offsetHeight;
}
exports.isHidden = isHidden;
function waitForElementToDisplay(element) {
    return elementWaitHelper(() => {
        return isVisible(element);
    });
}
exports.waitForElementToDisplay = waitForElementToDisplay;
function waitForElement(selector) {
    return elementWaitHelper(() => {
        return document.querySelector(selector);
    });
}
exports.waitForElement = waitForElement;
const elementWaitHelper = (resolver) => {
    return new Promise(function (resolve, reject) {
        let tries = 10;
        waitForElementInner(200);
        function waitForElementInner(time) {
            if (tries <= 0) {
                reject();
            }
            const reponse = resolver();
            if (reponse) {
                resolve(reponse);
            }
            else {
                setTimeout(function () {
                    tries--;
                    waitForElementInner(time);
                }, time);
            }
        }
    });
};


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MenuItem = void 0;
const dom_util_1 = __webpack_require__(6);
const BuySettingView_1 = __webpack_require__(8);
const SearchSettingView_1 = __webpack_require__(11);
const SellSettingView_1 = __webpack_require__(13);
class MenuItem {
    constructor() {
        this.filterBarView = new EAFilterBarView();
        this.filterBarView.addTab(0, "Buy/Bid Settings");
        this.filterBarView.addTab(1, "Sell Settings");
        this.filterBarView.addTab(2, "Search Settings");
        this.filterBarView.setActiveTab(0);
        this.filterBarView.layoutSubviews();
        this.filterBarView.addTarget(this, this.onSettingChange, EventType.TAP);
        const rootElement = this.filterBarView.getRootElement();
        rootElement.id = "futmenuitem";
        rootElement.setAttribute("style", "margin-top: 20px;");
        rootElement.append((0, BuySettingView_1.BuySettingView)());
        const menuContainer = (0, dom_util_1.find)(".menu-container", rootElement);
        if (menuContainer) {
            menuContainer.style.overflowX = "auto";
        }
        this.viewLookUp = new Map();
        this.viewLookUp.set(0, BuySettingView_1.BuySettingView);
        this.viewLookUp.set(1, SellSettingView_1.SellSettingView);
        this.viewLookUp.set(2, SearchSettingView_1.SearchSettingView);
    }
    getView() {
        return this.filterBarView.getRootElement();
    }
    onSettingChange(_, __, { index }) {
        var _a;
        const rootElement = this.filterBarView.getRootElement();
        (_a = (0, dom_util_1.find)(".buyer-settings-wrapper", rootElement)) === null || _a === void 0 ? void 0 : _a.remove();
        const view = this.viewLookUp.get(index);
        view && rootElement.append(view());
    }
}
exports.MenuItem = MenuItem;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BuySettingView = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const createNumericInput_1 = __webpack_require__(10);
const BuySettingView = () => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("buyer-settings-wrapper", "buy-settings-view");
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const buyerSetting = store.get("buy-setting");
    const buyPrice = (0, createNumericInput_1.createNumericInput)((value) => {
        buyerSetting.buyPrice = value || 0;
        store.set("buy-setting", buyerSetting);
    }, "Buy Price", buyerSetting.buyPrice, "buyer-settings-field");
    wrapperDiv.append(buyPrice);
    return wrapperDiv;
};
exports.BuySettingView = BuySettingView;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InMemoryStore = void 0;
class InMemoryStore {
    constructor() {
        this.entries = this.getDefaultState();
    }
    getDefaultState() {
        return {
            "buy-setting": {},
            "sell-setting": {},
            "search-setting": {
                randomMinBuy: 300,
                useRandomMinBuy: true,
            },
            "autobuyer-cache": {
                cachedBids: new Set(),
            },
        };
    }
    static getInstance() {
        if (!this.__instance) {
            this.__instance = new InMemoryStore();
        }
        return this.__instance;
    }
    has(key) {
        return !!this.entries[key];
    }
    delete(key) {
        return delete this.entries[key];
    }
    set(key, value) {
        return (this.entries[key] = value);
    }
    get(key) {
        return this.entries[key];
    }
    clear() {
        return (this.entries = this.getDefaultState());
    }
}
exports.InMemoryStore = InMemoryStore;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createNumericInput = void 0;
const createNumericInput = function (callBack, label, defaultValue, customClass) {
    var _a;
    const panelRow = document.createElement("div");
    panelRow.classList.add("panelActionRow");
    panelRow.style.fontSize = "1rem";
    if (customClass) {
        const classes = customClass.split(" ");
        for (let cl of classes)
            panelRow.classList.add(cl);
    }
    var buttonLabel = document.createElement("div");
    buttonLabel.classList.add("buttonInfoLabel");
    const labelContainer = document.createElement("span");
    labelContainer.classList.add("spinnerLabel");
    labelContainer.textContent = label;
    buttonLabel.append(labelContainer);
    panelRow.append(buttonLabel);
    const numericInput = new UTNumericInputSpinnerControl();
    numericInput.init();
    const numericTextInput = numericInput.getInput();
    numericTextInput.setPlaceholder(((_a = services.Localization) === null || _a === void 0 ? void 0 : _a.localize("roles.defaultRole")) || "");
    numericTextInput.addTarget(numericInput, () => callBack(numericInput.getValue()), EventType.CHANGE);
    defaultValue && numericInput.setValue(defaultValue);
    panelRow.append(numericInput.getRootElement());
    return panelRow;
};
exports.createNumericInput = createNumericInput;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchSettingView = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const createNumericInput_1 = __webpack_require__(10);
const createToggleInput_1 = __webpack_require__(12);
const SearchSettingView = () => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("buyer-settings-wrapper", "search-settings-view");
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const searchSetting = store.get("search-setting");
    const randomBuyPrice = (0, createNumericInput_1.createNumericInput)((value) => {
        searchSetting.randomMinBuy = value || 0;
        store.set("search-setting", searchSetting);
    }, "Random Min Buy Price", searchSetting.randomMinBuy || 300, "buyer-settings-field");
    const useRandomToggle = (0, createToggleInput_1.createToggleInput)("Use Random Min Buy", (toggled) => {
        searchSetting.useRandomMinBuy = toggled;
        store.set("search-setting", searchSetting);
    }, searchSetting.useRandomMinBuy, "buyer-settings-field");
    const runForeGroundToggle = (0, createToggleInput_1.createToggleInput)("Run in Foreground", (toggled) => {
        searchSetting.runForeGround = toggled;
        store.set("search-setting", searchSetting);
    }, searchSetting.runForeGround, "buyer-settings-field");
    wrapperDiv.append(runForeGroundToggle);
    wrapperDiv.append(randomBuyPrice);
    wrapperDiv.append(useRandomToggle);
    return wrapperDiv;
};
exports.SearchSettingView = SearchSettingView;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createToggleInput = void 0;
const createToggleInput = function (text, callBack, isDefaultToggled = false, customClass) {
    const panelRow = document.createElement("div");
    panelRow.classList.add("panelActionRow");
    panelRow.classList.add("toggle-control");
    panelRow.style.fontSize = "1rem";
    const toggleCellView = new UTToggleCellView();
    toggleCellView.init();
    isDefaultToggled && toggleCellView.toggle();
    toggleCellView.addTarget(toggleCellView, () => callBack(toggleCellView.getToggleState()), EventType.TAP);
    toggleCellView.setLabel(text);
    if (customClass) {
        const classes = customClass.split(" ");
        for (let cl of classes)
            panelRow.classList.add(cl);
    }
    panelRow.append(toggleCellView.getRootElement());
    return panelRow;
};
exports.createToggleInput = createToggleInput;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SellSettingView = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const createNumericInput_1 = __webpack_require__(10);
const SellSettingView = () => {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("buyer-settings-wrapper", "sell-settings-view");
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const sellSetting = store.get("sell-setting");
    const sellPrice = (0, createNumericInput_1.createNumericInput)((value) => {
        sellSetting.sellPrice = value || 0;
        store.set("sell-setting", sellSetting);
    }, "Sell Price", sellSetting.sellPrice, "buyer-settings-field");
    wrapperDiv.append(sellPrice);
    return wrapperDiv;
};
exports.SellSettingView = SellSettingView;


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoBuyerProcessor = void 0;
const Logger_1 = __webpack_require__(4);
const NotificationOrchestrator_1 = __webpack_require__(15);
const Timer_1 = __webpack_require__(17);
const TransferFactory_1 = __webpack_require__(18);
const enums_1 = __webpack_require__(5);
const dom_util_1 = __webpack_require__(6);
class AutoBuyerProcessor {
    constructor() {
        this.__interval = null;
        this.__controllerInstance = null;
        this.__isStarted = false;
        this.__isOperationInProgress = false;
    }
    static getInstance() {
        if (!this.__instance) {
            this.__instance = new AutoBuyerProcessor();
        }
        return this.__instance;
    }
    setControllerInstance(instance) {
        this.__controllerInstance = instance;
    }
    runActions() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const searchCriteria = (_a = this.__controllerInstance) === null || _a === void 0 ? void 0 : _a._viewmodel.searchCriteria;
            if (!searchCriteria || this.__isOperationInProgress) {
                return;
            }
            services.Notification.clearAll();
            const orchestrator = TransferFactory_1.TransferFactory.getInstance().getTransferOrchestrator();
            this.__isOperationInProgress = true;
            try {
                const results = yield orchestrator.searchMarket(searchCriteria);
                if (results) {
                    const purchasedItem = yield orchestrator.handleTransferResults(results);
                    if (purchasedItem) {
                        yield orchestrator.handleWonItem(purchasedItem);
                    }
                }
            }
            catch (err) {
                Logger_1.Logger.writeToLog("Error occured");
            }
            this.__isOperationInProgress = false;
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.__isStarted) {
                return;
            }
            Logger_1.Logger.writeToLog("Autobuyer Started");
            NotificationOrchestrator_1.NotificationOrchestrator.getInstance().notify("Autobuyer Started", { ui: true }, enums_1.UINotificationTypeEnum.POSITIVE);
            const contentView = (0, dom_util_1.find)(".ut-navigation-container-view--content");
            if (contentView) {
                contentView.scrollTop = contentView.scrollHeight;
            }
            this.__isStarted = true;
            this.__interval = new Timer_1.Timer(this.runActions.bind(this), 5, 10);
            this.__interval.run();
        });
    }
    stop() {
        var _a;
        (_a = this.__interval) === null || _a === void 0 ? void 0 : _a.stop();
        this.__isStarted = false;
        Logger_1.Logger.writeToLog("Autobuyer Stopped");
        NotificationOrchestrator_1.NotificationOrchestrator.getInstance().notify("Autobuyer Stopped", { ui: true }, enums_1.UINotificationTypeEnum.NEGATIVE);
    }
    pause() { }
    resume() { }
}
exports.AutoBuyerProcessor = AutoBuyerProcessor;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationOrchestrator = void 0;
const enums_1 = __webpack_require__(5);
const UINotification_1 = __webpack_require__(16);
class NotificationOrchestrator {
    constructor() {
        this.instanceLookUp = new Map();
        this.instanceLookUp.set("ui", new UINotification_1.UINotification());
    }
    static getInstance() {
        if (!this.__instance) {
            this.__instance = new NotificationOrchestrator();
        }
        return this.__instance;
    }
    notify(message, destination, notificationType = enums_1.UINotificationTypeEnum.NEUTRAL) {
        var _a;
        if (destination.ui) {
            (_a = this.instanceLookUp.get("ui")) === null || _a === void 0 ? void 0 : _a.notify(message, notificationType);
        }
    }
}
exports.NotificationOrchestrator = NotificationOrchestrator;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UINotification = void 0;
const enums_1 = __webpack_require__(5);
class UINotification {
    notify(message, notificationType = enums_1.UINotificationTypeEnum.NEUTRAL) {
        setTimeout(() => {
            services.Notification.queue([message, notificationType]);
        }, 250);
    }
}
exports.UINotification = UINotification;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(intervalFunction, start, end) {
        this.intervalFunction = intervalFunction;
        this.start = start;
        this.end = end;
        this.isCleared = false;
        this.timeout = 0;
    }
    runInterval() {
        if (this.isCleared)
            return;
        const searchInterval = {
            start: Date.now(),
            end: 0,
        };
        const timeoutFunction = () => {
            this.intervalFunction();
            this.runInterval();
        };
        const delay = parseFloat((Math.random() * (this.end - this.start) + this.start).toFixed(1)) * 1000;
        searchInterval.end = searchInterval.start + delay;
        this.timeout = window.setTimeout(timeoutFunction, delay);
    }
    stop() {
        this.isCleared = true;
        clearTimeout(this.timeout);
    }
    run() {
        this.isCleared = false;
        this.intervalFunction();
        this.runInterval();
    }
}
exports.Timer = Timer;


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransferFactory = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const BackGroundTransferOrchestrator_1 = __webpack_require__(19);
const ForeGroundTransferOrchestrator_1 = __webpack_require__(40);
class TransferFactory {
    constructor() {
        this.instanceLookUp = new Map();
        this.instanceLookUp.set(0, new BackGroundTransferOrchestrator_1.BackGroundTransferOrchestrator());
        this.instanceLookUp.set(1, new ForeGroundTransferOrchestrator_1.ForeGroundTransferOrchestrator());
    }
    static getInstance() {
        if (!this.__instance) {
            this.__instance = new TransferFactory();
        }
        return this.__instance;
    }
    getTransferOrchestrator() {
        const key = InMemoryStore_1.InMemoryStore.getInstance().get("search-setting").runForeGround
            ? 1
            : 0;
        return this.instanceLookUp.get(key);
    }
}
exports.TransferFactory = TransferFactory;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BackGroundTransferOrchestrator = void 0;
const handleWonItems_service_1 = __webpack_require__(20);
const transferResult_service_1 = __webpack_require__(27);
const transferSearch_service_1 = __webpack_require__(34);
class BackGroundTransferOrchestrator {
    searchMarket(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transferSearch_service_1.searchMarketBG)(searchCriteria);
        });
    }
    handleTransferResults(items) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transferResult_service_1.handleTransferResultsBG)(items);
        });
    }
    handleWonItem(item) {
        return (0, handleWonItems_service_1.handleWonItemBG)(item);
    }
}
exports.BackGroundTransferOrchestrator = BackGroundTransferOrchestrator;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleWonItemBG = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const Logger_1 = __webpack_require__(4);
const runSellHooks_1 = __webpack_require__(21);
const enums_1 = __webpack_require__(5);
const item_service_1 = __webpack_require__(24);
const transferMarket_service_1 = __webpack_require__(26);
const handleWonItemBG = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const errorMessage = (0, runSellHooks_1.runSellHooks)(item);
    if (errorMessage) {
        Logger_1.Logger.writeToLog(errorMessage, enums_1.UINotificationTypeEnum.NEGATIVE);
        return;
    }
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { sellPrice } = store.get("sell-setting");
    if (sellPrice) {
        yield sellItem(item, sellPrice);
    }
    else {
        sendToClub(item);
    }
});
exports.handleWonItemBG = handleWonItemBG;
const sendToClub = (item) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, item_service_1.move)(item, ItemPile.CLUB);
    Logger_1.Logger.writeToLog("Moved to club");
});
const sellItem = (item, sellPrice) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, transferMarket_service_1.listItem)(item, sellPrice);
    Logger_1.Logger.writeToLog(`Listed for ${sellPrice}`, enums_1.UINotificationTypeEnum.POSITIVE);
});


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runSellHooks = void 0;
const runHooks_1 = __webpack_require__(22);
const checkTransferListSize_1 = __webpack_require__(23);
const hooks = [checkTransferListSize_1.checkTransferListSize];
const runSellHooks = (item) => {
    return (0, runHooks_1.runHooks)(hooks, item);
};
exports.runSellHooks = runSellHooks;


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runHooks = void 0;
const runHooks = (hooks, params) => {
    for (const hook of hooks) {
        const errorMessage = hook(params);
        if (errorMessage) {
            return errorMessage;
        }
    }
    return null;
};
exports.runHooks = runHooks;


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkTransferListSize = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const enums_1 = __webpack_require__(5);
const checkTransferListSize = (_) => {
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { sellPrice } = store.get("sell-setting");
    if (sellPrice && repositories.Item.isPileFull(enums_1.UTItemPile.TRANSFER)) {
        return "Unable to list, transfer List if Full";
    }
    return null;
};
exports.checkTransferListSize = checkTransferListSize;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.move = void 0;
const observableToPromise_1 = __webpack_require__(25);
const move = (item, pile) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, observableToPromise_1.observableToPromise)(services.Item.move(item, pile));
    return true;
});
exports.move = move;


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.observableToPromise = void 0;
const observableToPromise = (observable) => {
    return new Promise((resolve, reject) => {
        observable.observe(this, (_, { data, success, error }) => {
            if (success)
                resolve(data);
            else
                reject(error.code);
        });
    });
};
exports.observableToPromise = observableToPromise;


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.listItem = exports.bidItem = exports.searchTransferMarket = void 0;
const observableToPromise_1 = __webpack_require__(25);
const searchTransferMarket = (options) => __awaiter(void 0, void 0, void 0, function* () {
    services.Item.clearTransferMarketCache();
    const response = yield (0, observableToPromise_1.observableToPromise)(services.Item.searchTransferMarket(options, 1));
    return response.items;
});
exports.searchTransferMarket = searchTransferMarket;
const bidItem = (item, coins) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, observableToPromise_1.observableToPromise)(services.Item.bid(item, coins));
    return true;
});
exports.bidItem = bidItem;
const listItem = (item, sellPrice) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, observableToPromise_1.observableToPromise)(services.Item.list(item, UTCurrencyInputControl.getIncrementBelowVal(sellPrice), sellPrice, 3600));
    return true;
});
exports.listItem = listItem;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleTransferResultsBG = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const Logger_1 = __webpack_require__(4);
const runBidHooks_1 = __webpack_require__(28);
const enums_1 = __webpack_require__(5);
const pinEvents_service_1 = __webpack_require__(33);
const transferMarket_service_1 = __webpack_require__(26);
const handleTransferResultsBG = (items) => __awaiter(void 0, void 0, void 0, function* () {
    if (items.length) {
        (0, pinEvents_service_1.sendPinEvents)("Transfer Market Results - List View");
        const store = InMemoryStore_1.InMemoryStore.getInstance();
        const buyerSetting = store.get("buy-setting");
        for (const item of items) {
            const errorMessage = (0, runBidHooks_1.runBidHooks)(item);
            if (errorMessage) {
                Logger_1.Logger.writeToLog(errorMessage, enums_1.UINotificationTypeEnum.NEGATIVE);
                continue;
            }
            const isSuccess = yield (0, transferMarket_service_1.bidItem)(item, item._auction.buyNowPrice).catch((err) => {
                Logger_1.Logger.writeToLog("Buy Failed", enums_1.UINotificationTypeEnum.NEGATIVE);
            });
            if (isSuccess) {
                Logger_1.Logger.writeToLog(`Buy Success ${buyerSetting.buyPrice}`, enums_1.UINotificationTypeEnum.POSITIVE);
                return item;
            }
            break;
        }
    }
});
exports.handleTransferResultsBG = handleTransferResultsBG;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runBidHooks = void 0;
const runHooks_1 = __webpack_require__(22);
const addToCache_1 = __webpack_require__(29);
const checkBuyPrice_1 = __webpack_require__(30);
const checkIfCached_1 = __webpack_require__(31);
const checkIfExpired_1 = __webpack_require__(32);
const hooks = [checkIfCached_1.checkIfCached, checkIfExpired_1.checkIfExpired, checkBuyPrice_1.checkBuyPrice, addToCache_1.addToCache];
const runBidHooks = (item) => {
    return (0, runHooks_1.runHooks)(hooks, item);
};
exports.runBidHooks = runBidHooks;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addToCache = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const addToCache = (item) => {
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { cachedBids } = store.get("autobuyer-cache");
    cachedBids === null || cachedBids === void 0 ? void 0 : cachedBids.add(item._auction.tradeId);
    return null;
};
exports.addToCache = addToCache;


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBuyPrice = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const checkBuyPrice = (item) => {
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { buyPrice } = store.get("buy-setting");
    if (!buyPrice || item._auction.buyNowPrice <= buyPrice) {
        return null;
    }
    return "BIN is greater than user price";
};
exports.checkBuyPrice = checkBuyPrice;


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkIfCached = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const checkIfCached = (item) => {
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { cachedBids } = store.get("autobuyer-cache");
    if (cachedBids === null || cachedBids === void 0 ? void 0 : cachedBids.has(item._auction.tradeId)) {
        console.log("cachced");
        return "Cached Item";
    }
    return null;
};
exports.checkIfCached = checkIfCached;


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkIfExpired = void 0;
const checkIfExpired = (item) => {
    if (item.getAuctionData().isExpired()) {
        return "Auction Expired";
    }
    return null;
};
exports.checkIfExpired = checkIfExpired;


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sendPinEvents = void 0;
const sendPinEvents = (pageId) => {
    services.PIN.sendData(PINEventType.PAGE_VIEW, {
        type: PIN_PAGEVIEW_EVT_TYPE,
        pgid: pageId,
    });
};
exports.sendPinEvents = sendPinEvents;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.searchMarketBG = void 0;
const pinEvents_service_1 = __webpack_require__(33);
const transferMarket_service_1 = __webpack_require__(26);
const runSearchHooks_1 = __webpack_require__(35);
const Logger_1 = __webpack_require__(4);
const enums_1 = __webpack_require__(5);
const searchMarketBG = (searchCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    const errorMessage = (0, runSearchHooks_1.runSearchHooks)(searchCriteria);
    if (errorMessage) {
        Logger_1.Logger.writeToLog(errorMessage, enums_1.UINotificationTypeEnum.NEGATIVE);
        return;
    }
    (0, pinEvents_service_1.sendPinEvents)("Hub - Transfers");
    const transferResult = yield (0, transferMarket_service_1.searchTransferMarket)(searchCriteria);
    return transferResult;
});
exports.searchMarketBG = searchMarketBG;


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.runSearchHooks = void 0;
const runHooks_1 = __webpack_require__(22);
const buyPriceValidator_1 = __webpack_require__(36);
const randomMinBuyChange_1 = __webpack_require__(37);
const hooks = [buyPriceValidator_1.buyPriceValidator, randomMinBuyChange_1.randomMinBuyChange];
const runSearchHooks = (searchCriteria) => {
    return (0, runHooks_1.runHooks)(hooks, searchCriteria);
};
exports.runSearchHooks = runSearchHooks;


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buyPriceValidator = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const buyPriceValidator = (_) => {
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { buyPrice, bidPrice } = store.get("buy-setting");
    if (!buyPrice && !bidPrice) {
        return "No buy price/bid price given";
    }
    return null;
};
exports.buyPriceValidator = buyPriceValidator;


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.randomMinBuyChange = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const mathUtil_1 = __webpack_require__(38);
const priceUtil_1 = __webpack_require__(39);
const randomMinBuyChange = (searchCriteria) => {
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { useRandomMinBuy, randomMinBuy } = store.get("search-setting");
    if (useRandomMinBuy && randomMinBuy) {
        searchCriteria.minBuy = (0, priceUtil_1.roundOffPrice)((0, mathUtil_1.getRandomNumberInRange)(0, randomMinBuy));
    }
    return null;
};
exports.randomMinBuyChange = randomMinBuyChange;


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandomNumberInRange = void 0;
const getRandomNumberInRange = (min, max) => Math.round(Math.random() * (max - min) + min);
exports.getRandomNumberInRange = getRandomNumberInRange;


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.roundOffPrice = void 0;
const roundOffPrice = (price, minVal = 0) => {
    let range = JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, function (e) {
        return price >= e.min;
    });
    var nearestPrice = Math.round(price / range.inc) * range.inc;
    return Math.max(Math.min(nearestPrice, 14999000), minVal);
};
exports.roundOffPrice = roundOffPrice;


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForeGroundTransferOrchestrator = void 0;
const handleWonItems_service_1 = __webpack_require__(41);
const transferResult_service_1 = __webpack_require__(44);
const transferSearch_service_1 = __webpack_require__(45);
class ForeGroundTransferOrchestrator {
    searchMarket(searchCriteria) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transferSearch_service_1.searchMarketFG)(searchCriteria);
        });
    }
    handleTransferResults(items) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, transferResult_service_1.handleTransferResultsFG)(items);
        });
    }
    handleWonItem(item) {
        return (0, handleWonItems_service_1.handleWonItemFG)(item);
    }
}
exports.ForeGroundTransferOrchestrator = ForeGroundTransferOrchestrator;


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleWonItemFG = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const NotificationOrchestrator_1 = __webpack_require__(15);
const runSellHooks_1 = __webpack_require__(21);
const enums_1 = __webpack_require__(5);
const commonUtil_1 = __webpack_require__(42);
const dom_util_1 = __webpack_require__(6);
const events_util_1 = __webpack_require__(43);
const handleWonItemFG = (item) => __awaiter(void 0, void 0, void 0, function* () {
    const errorMessage = (0, runSellHooks_1.runSellHooks)(item);
    const notificationInstance = NotificationOrchestrator_1.NotificationOrchestrator.getInstance();
    if (errorMessage) {
        notificationInstance.notify(errorMessage, { ui: true }, enums_1.UINotificationTypeEnum.NEGATIVE);
        return;
    }
    const element = yield (0, dom_util_1.waitForElement)(".won");
    (0, events_util_1.tapElement)(element);
    yield (0, commonUtil_1.wait)(0.3);
    const store = InMemoryStore_1.InMemoryStore.getInstance();
    const { sellPrice } = store.get("sell-setting");
    if (sellPrice) {
        yield sellItem(sellPrice);
        notificationInstance.notify(`Listed for ${sellPrice}`, { ui: true }, enums_1.UINotificationTypeEnum.NEGATIVE);
    }
    else {
        sendToClub();
    }
});
exports.handleWonItemFG = handleWonItemFG;
const sendToClub = () => __awaiter(void 0, void 0, void 0, function* () {
    const sendToClubBtn = (0, dom_util_1.findByText)("button", services.Localization.localize("infopanel.label.club"));
    if (sendToClubBtn) {
        (0, events_util_1.tapElement)(sendToClubBtn);
    }
    else {
        NotificationOrchestrator_1.NotificationOrchestrator.getInstance().notify("Cannot move - duplicate item", { ui: true }, enums_1.UINotificationTypeEnum.NEGATIVE);
    }
});
const sellItem = (sellPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const quickListPanel = (0, dom_util_1.find)(".ut-quick-list-panel-view");
    const listPanel = (0, dom_util_1.find)(".accordian", quickListPanel);
    listPanel && (0, events_util_1.tapElement)(listPanel);
    const buyNowPrice = (0, dom_util_1.findByText)(".spinnerLabel", services.Localization.localize("auctioninfo.buynowprice"));
    const buyNowPriceInput = (0, dom_util_1.find)(".ut-number-input-control", buyNowPrice.parentElement.parentElement);
    yield (0, dom_util_1.waitForElementToDisplay)(buyNowPriceInput);
    buyNowPriceInput.value = `${sellPrice}`;
    (0, events_util_1.dispatchChangeEvent)(buyNowPriceInput);
    yield (0, commonUtil_1.wait)(0.3);
    (0, events_util_1.tap)(".call-to-action");
    yield (0, commonUtil_1.wait)(0.3);
});


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wait = void 0;
const wait = (seconds = 1) => __awaiter(void 0, void 0, void 0, function* () {
    const rndFactor = Math.floor(Math.random());
    yield new Promise((resolve) => setTimeout(resolve, (rndFactor + seconds) * 1000));
});
exports.wait = wait;


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tapElement = exports.tap = exports.dispatchChangeEvent = exports.dispatchTapEvent = void 0;
const dom_util_1 = __webpack_require__(6);
const dispatchTapEvent = (element, event) => {
    const mouseEvent = new MouseEvent(event);
    element.dispatchEvent(mouseEvent);
};
exports.dispatchTapEvent = dispatchTapEvent;
const dispatchChangeEvent = (element) => {
    const event = new Event("change");
    element.dispatchEvent(event);
};
exports.dispatchChangeEvent = dispatchChangeEvent;
const tap = (selector) => {
    const element = (0, dom_util_1.find)(selector);
    if (element) {
        (0, exports.dispatchTapEvent)(element, "mousedown");
        (0, exports.dispatchTapEvent)(element, "mouseup");
    }
};
exports.tap = tap;
const tapElement = (element) => {
    (0, exports.dispatchTapEvent)(element, "mousedown");
    (0, exports.dispatchTapEvent)(element, "mouseup");
};
exports.tapElement = tapElement;


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleTransferResultsFG = void 0;
const InMemoryStore_1 = __webpack_require__(9);
const NotificationOrchestrator_1 = __webpack_require__(15);
const runBidHooks_1 = __webpack_require__(28);
const enums_1 = __webpack_require__(5);
const transferMarket_service_1 = __webpack_require__(26);
const handleTransferResultsFG = (items) => __awaiter(void 0, void 0, void 0, function* () {
    if (items.length) {
        const notificationInstance = NotificationOrchestrator_1.NotificationOrchestrator.getInstance();
        const store = InMemoryStore_1.InMemoryStore.getInstance();
        const buyerSetting = store.get("buy-setting");
        for (const item of items) {
            const errorMessage = (0, runBidHooks_1.runBidHooks)(item);
            if (errorMessage) {
                notificationInstance.notify(errorMessage, { ui: true }, enums_1.UINotificationTypeEnum.NEGATIVE);
                continue;
            }
            const isSuccess = yield (0, transferMarket_service_1.bidItem)(item, item._auction.buyNowPrice).catch((err) => {
                notificationInstance.notify("Buy failed", {
                    ui: true,
                }, enums_1.UINotificationTypeEnum.NEGATIVE);
            });
            if (isSuccess) {
                notificationInstance.notify(`Buy Success ${buyerSetting.buyPrice}`, {
                    ui: true,
                }, enums_1.UINotificationTypeEnum.POSITIVE);
                return item;
            }
            break;
        }
    }
});
exports.handleTransferResultsFG = handleTransferResultsFG;


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.searchMarketFG = void 0;
const runSearchHooks_1 = __webpack_require__(35);
const events_util_1 = __webpack_require__(43);
const getCurrentController_1 = __webpack_require__(46);
const controller_typeGuard_1 = __webpack_require__(47);
const dom_util_1 = __webpack_require__(6);
const NotificationOrchestrator_1 = __webpack_require__(15);
const enums_1 = __webpack_require__(5);
const commonUtil_1 = __webpack_require__(42);
const searchMarketFG = (searchCriteria) => __awaiter(void 0, void 0, void 0, function* () {
    const errorMessage = (0, runSearchHooks_1.runSearchHooks)(searchCriteria);
    if (errorMessage) {
        NotificationOrchestrator_1.NotificationOrchestrator.getInstance().notify(errorMessage, { ui: true }, enums_1.UINotificationTypeEnum.NEGATIVE);
        return;
    }
    const itemDetailsBackElement = (0, dom_util_1.findByText)(".ut-navigation-bar-view", services.Localization.localize("navbar.label.detailView"));
    if (itemDetailsBackElement) {
        const backButton = (0, dom_util_1.find)(".ut-navigation-button-control:not(.menu-btn)", itemDetailsBackElement);
        backButton && (0, events_util_1.tapElement)(backButton);
        yield (0, commonUtil_1.wait)(0.3);
    }
    const resultBackElement = (0, dom_util_1.findByText)(".ut-navigation-bar-view", services.Localization.localize("navbar.label.searchresults"));
    if (resultBackElement) {
        const backButton = (0, dom_util_1.find)(".ut-navigation-button-control:not(.menu-btn)", resultBackElement);
        backButton && (0, events_util_1.tapElement)(backButton);
        yield (0, commonUtil_1.wait)(0.3);
    }
    else {
        (0, events_util_1.tap)(".icon-transfer");
        yield (0, commonUtil_1.wait)(0.5);
        (0, events_util_1.tap)(".ut-tile-transfer-market");
        yield (0, commonUtil_1.wait)(0.3);
    }
    const currentController = (0, getCurrentController_1.getCurrentController)();
    if ((0, controller_typeGuard_1.isMarketSearchFilterViewController)(currentController)) {
        Object.assign(currentController._viewmodel.searchCriteria, searchCriteria);
        currentController.viewDidAppear();
        (0, events_util_1.tap)(".call-to-action");
        yield (0, dom_util_1.waitForElement)(".SearchResults");
        const currentResultController = (0, getCurrentController_1.getCurrentController)();
        if ((0, controller_typeGuard_1.isMarketSearchResultSplitViewController)(currentResultController)) {
            return currentResultController._leftController._paginationViewModel.getCurrentPageItems();
        }
        else if ((0, controller_typeGuard_1.isMarketSearchResultViewController)(currentResultController)) {
            return currentResultController._paginationViewModel.getCurrentPageItems();
        }
    }
});
exports.searchMarketFG = searchMarketFG;


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrentController = void 0;
const getCurrentController = () => {
    return getAppMain()
        .getRootViewController()
        .getPresentedViewController()
        .getCurrentViewController()
        .getCurrentController();
};
exports.getCurrentController = getCurrentController;


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isMarketSearchResultViewController = exports.isMarketSearchResultSplitViewController = exports.isMarketSearchFilterViewController = void 0;
function isMarketSearchFilterViewController(controller) {
    var _a;
    return (((_a = controller === null || controller === void 0 ? void 0 : controller._viewmodel) === null || _a === void 0 ? void 0 : _a.searchCriteria) !== undefined);
}
exports.isMarketSearchFilterViewController = isMarketSearchFilterViewController;
function isMarketSearchResultSplitViewController(controller) {
    var _a;
    return (((_a = controller === null || controller === void 0 ? void 0 : controller._leftController) === null || _a === void 0 ? void 0 : _a._paginationViewModel) !== undefined);
}
exports.isMarketSearchResultSplitViewController = isMarketSearchResultSplitViewController;
function isMarketSearchResultViewController(controller) {
    return ((controller === null || controller === void 0 ? void 0 : controller._paginationViewModel) !== undefined);
}
exports.isMarketSearchResultViewController = isMarketSearchResultViewController;


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createButton = void 0;
const createButton = function (text, callBack, customClass) {
    const stdButton = new UTStandardButtonControl();
    stdButton.init();
    stdButton.addTarget(stdButton, callBack, EventType.TAP);
    stdButton.setText(text);
    if (customClass) {
        const classes = customClass.split(" ");
        for (let cl of classes)
            stdButton.getRootElement().classList.add(cl);
    }
    return stdButton;
};
exports.createButton = createButton;


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logView = void 0;
const Logger_1 = __webpack_require__(4);
const dom_util_1 = __webpack_require__(6);
const createButton_1 = __webpack_require__(48);
const logView = () => {
    const logContainer = (0, dom_util_1.htmlToElement)(`<div style=${!isPhone()
        ? "width:48%"
        : "height: 90%;display: flex;flex-direction: column;padding: 7px;"}  >
            <div class="logs-container">
              <label>Logs:</label>
              <div data-title="Clear logs" class="button-clear">
              </div>
            </div>
            <br/>
            <div class="logWrapper">
              <div wrap="off"  style="height: 100%;overflow-x: auto;resize: none; width: 100%;" readonly class="autoBuyerLog"></div>
              <a class="joinServer" target="_blank" rel="noopener noreferrer" href="https://discord.com/invite/cktHYmp">Join Our Discord Server</a>
            <br/>
        </div>`);
    const buttons = (0, dom_util_1.find)(".button-clear", logContainer);
    buttons === null || buttons === void 0 ? void 0 : buttons.append((0, createButton_1.createButton)("⎚", () => Logger_1.Logger.clear()).getRootElement());
    return logContainer;
};
exports.logView = logView;


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.styleOverride = void 0;
const styleOverride = () => {
    const style = document.createElement("style");
    style.innerText = `
        .buyer-header {
            font-size: 20px !important;
        }
        .with-fifa-header .ut-root-view {
          height: 100%;
        }
        .buyer-settings {
            width: 100%;
        }
        .buyer-settings-field {
          margin: 15px;
          width: 45%;
        }
        .phone .buyer-settings-field{
          margin-top: auto;
          margin-bottom: auto;
          width: 100%;
          padding: 10px;
        }
        .buyer-settings-wrapper {
          display: flex; 
          flex-wrap: wrap; 
          margin-top: 20px;
          justify-content: space-between;
        }
        .buyer-settings-field input:disabled {
          background-color: #c3c6ce;
          cursor: not-allowed;
        }
        .btn-test-notification
        {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input[type="number"]{
          padding: 0 .5em;
          border-radius: 0;
          background-color: #262c38;
          border: 1px solid #4ee6eb;
          box-sizing: border-box;
          color: #4ee6eb;
          font-family: UltimateTeam,sans-serif;
          font-size: 1em;
          height: 2.8em;
          opacity: 1;
          width: 100%;
        }
        .autoBuyerLog {
          font-size: ${!isPhone() ? "15px" : "13px"}; 
          height: 50%;
          background-color:#141414;
          color:#e2dde2;
        }
        .searchLog {
          font-size: 10px; 
          height: 50%;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        .captcha-settings-view input,
        .notification-settings-view input {
          text-transform: none;
        }
        .phone .buyer-header{
          font-size: 1.2em !important;
        }
        .phone .buyer-actions .btn-standard{
          padding: 0;
          font-size: 1.2em;
          text-overflow: unset;
        }
        .filter-header-settings {
          width: 100%;
          padding: 10px;
          font-family: UltimateTeamCondensed, sans-serif;
          font-size: 1.6em;
          color: #e2dde2;
          text-transform: uppercase;
          background-color: #171826;
        }
        .btn-save-filter {
          width:100%
        }
        .btn-delete-filter {
          width:50%
        }
        .multiple-filter {
          width: 100%  !important;
          display: flex  !important;
          justify-content: center;
          align-items: center;
        }
        .logs-container {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          align-items: center;
        }
        .button-clear button {
          color: #fff;
          background-color: unset;
          height: unset;
          line-height: unset;
        }
        .top-nav{
          display:flex; 
        }
        .ut-navigation-button-control.menu-btn:before {
          content: "≡";
          transform: unset;
        }
        .menu-btn {
          min-width: 0px;
          margin-left: 5px;
        }
        .filterSync {
          background: transparent;
          color: #c4f750;
          text-overflow: clip;
        }
        .filterSync:hover {
          background: transparent !important;
        }
        .stats-progress {
          float: right; 
          height: 10px; 
          width: 100px; 
          background: #888; 
          margin: ${isPhone() ? "auto 5px" : "5px 0px 5px 5px"};
        }
        .stats-fill {
          background: #000; 
          height: 10px; 
          width: 0%
        }
        .numericInput:invalid {
          color: red;
          border: 1px solid;
        }
        .ignore-players{
          width: 100%;
          display: flex;
          background: transparent;
        }
        .ignore-players .ut-player-search-control{
          width: 90% !important;
        }
        .ignore-players filterSync{
          flex: unset;
        }
        .font15 {
          font-size: 15px;
        }  
        .action-icons {
          display: unset !important;
          width: 10%
        }
        .displayCenterFlx {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .displayNone {
          height: 275px;
        }
        .displayNone .inline-list-select,
        .displayNone .search-prices,
        .displayNone .btn-actions,
        .displayNone .btn-filters,
        .displayNone .btn-report,
        .displayNone .buyer-actions .btn-other {
          display: none !important;
        }
        .mrg10 {
          margin: 10px;
        }
        .download-stats {
          line-height: 1;
          display: flex;
        }
        .btn-report {
          display: flex;
          justify-content: center;
        }
        small{
          white-space: break-spaces;
        }  
        .joinServer {
          position: absolute;
          right: 25px;
          top: 50%;
          color: wheat
        }
        .phone .joinServer{
          display: none;
        }
        textarea {
          resize: none;
        }  
        .logWrapper {
          position: relative;
          height: 100%
        } 
       
        .auto-buyer .autoBuyMin{
          display: none;
        }
        .auto-buyer .search-prices .settings-field{
          display: none;
        }

        .buyer-settings-field .ut-toggle-cell-view{
          background-color: #1e242a;
          border: solid 1px #556c95;
          color: #f2f2f2;
          width: 100%;
        }

         .toggle-control {
          justify-content: center;
          align-items: center;
          display: flex;
          margin-bottom: 0px;
        }

        .ut-fifa-header-view{
          display: none !important;
        }
        .ui-orientation-warning {
          display: none !important;
        }
        `;
    style.innerText += getScrollBarStyle();
    document.head.appendChild(style);
};
exports.styleOverride = styleOverride;
const getScrollBarStyle = () => {
    return `
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }
        ::-webkit-scrollbar:vertical {
            width: 12px;
        }
        ::-webkit-scrollbar:horizontal {
            height: 12px;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, .5);
            border-radius: 10px;
            border: 2px solid #ffffff;
        }
        ::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #ffffff;
        }`;
};


/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.topNavBarOverride = void 0;
const dom_util_1 = __webpack_require__(6);
const topNavBarOverride = () => {
    const layoutSubViews = UTNavigationBarView.prototype.layoutSubviews;
    UTNavigationBarView.prototype.layoutSubviews = function (...args) {
        var _a, _b;
        const result = layoutSubViews.call(this, ...args);
        if (this.primaryButton && this.__clubInfo) {
            this._menuBtn && this._menuBtn.removeFromSuperview();
            this._menuBtn = generateNavButton.call(this);
            const settingBtn = this.primaryButton.getRootElement();
            const menuBtn = this._menuBtn.getRootElement();
            (_a = (0, dom_util_1.find)(".top-nav")) === null || _a === void 0 ? void 0 : _a.remove();
            const wrapper = document.createElement("div");
            wrapper.classList.add("top-nav");
            wrapper.appendChild(settingBtn);
            (_b = settingBtn.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(menuBtn, settingBtn);
            console.log(wrapper);
            const topBarElement = this.getRootElement();
            topBarElement.insertBefore(wrapper, topBarElement.firstChild);
        }
        return result;
    };
    const generateNavButton = () => {
        const menuBtn = new UTNavigationButtonControl();
        menuBtn.init();
        menuBtn.addClass("menu-btn");
        menuBtn.setInteractionState(!0);
        menuBtn.addTarget(this, () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "OpenDrawer" }));
        }, EventType.TAP);
        return menuBtn;
    };
};
exports.topNavBarOverride = topNavBarOverride;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const initializeOverrides_1 = __webpack_require__(1);
const dom_util_1 = __webpack_require__(6);
const initAutobuyer = function () {
    var _a, _b;
    let isHomePageLoaded = false;
    if (isPhone()) {
        const classList = (_a = (0, dom_util_1.find)("body")) === null || _a === void 0 ? void 0 : _a.classList;
        if (classList) {
            classList.remove("landscape");
            classList.add("phone");
        }
    }
    const orientationWarning = (0, dom_util_1.find)(".ui-orientation-warning");
    const headerView = (0, dom_util_1.find)(".ut-fifa-header-view");
    if (orientationWarning) {
        orientationWarning.style.display = "none !important";
    }
    if (headerView) {
        headerView.style.display = "none !important";
    }
    if (services.Localization &&
        ((_b = (0, dom_util_1.find)("h1.title")) === null || _b === void 0 ? void 0 : _b.innerHTML) ===
            services.Localization.localize("navbar.label.home")) {
        isHomePageLoaded = true;
    }
    if (isHomePageLoaded) {
    }
    else {
        setTimeout(initAutobuyer, 1000);
    }
};
const initFunctionOverrides = function () {
    let isPageLoaded = false;
    if (services.Localization) {
        isPageLoaded = true;
    }
    if (isPageLoaded) {
        (0, initializeOverrides_1.initializeOverrides)();
        initAutobuyer();
    }
    else {
        setTimeout(initFunctionOverrides, 1000);
    }
};
initFunctionOverrides();

})();

/******/ })()
;
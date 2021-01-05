"use strict";
/**
 * JS API
 * https://aitrade.ga/books/tradingview/book/JS-Api.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFeed = exports.version = exports.widget = void 0;
var library_min_js_1 = require("./library.min.js");
Object.defineProperty(exports, "widget", { enumerable: true, get: function () { return library_min_js_1.widget; } });
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return library_min_js_1.version; } });
var DataFeed = /** @class */ (function () {
    function DataFeed(options) {
        if (options === void 0) { options = {}; }
        this.configuration = {};
        this.subscribers = {};
        this.requesting = false;
        this.options = options;
    }
    /**
     * 此方法可以设置图表库支持的图表配置。这些数据会影响到图表支持的功能
     */
    DataFeed.prototype.onReady = function (callback) {
        var _this = this;
        new Promise(function (resolve) {
            resolve(void 0);
        }).then(function () {
            var fetchConfiguration = _this.options.fetchConfiguration;
            _this.configuration = _this.defaultConfiguration();
            if (!fetchConfiguration) {
                callback(_this.configuration);
                return;
            }
            fetchConfiguration().then(function (configuration) {
                _this.configuration = Object.assign(_this.configuration, configuration);
                callback(_this.configuration);
            });
        });
    };
    /**
     * 提供一个匹配用户搜索的商品列表
     */
    DataFeed.prototype.searchSymbols = function (userInput, exchange, symbolType, onResult) {
        var fetchSearchSymbols = this.options.fetchSearchSymbols;
        if (!fetchSearchSymbols) {
            return;
        }
        fetchSearchSymbols({ userInput: userInput, exchange: exchange, symbolType: symbolType })
            .then(onResult)
            .catch(function () {
            onResult([]);
        });
    };
    /**
     * 通过商品名称解析商品信息
     */
    DataFeed.prototype.resolveSymbol = function (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        var fetchResolveSymbol = this.options.fetchResolveSymbol;
        if (!fetchResolveSymbol) {
            return;
        }
        fetchResolveSymbol(symbolName)
            .then(onSymbolResolvedCallback)
            .catch(function () {
            onResolveErrorCallback("Error fetchResolveSymbol");
        });
    };
    /**
     * 当图表库需要由日期范围定义的历史K线片段时，将调用此函数
     */
    DataFeed.prototype.getBars = function (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        var _this = this;
        var getBars = this.options.getBars;
        if (!getBars) {
            return;
        }
        if (this.requesting) {
            return;
        }
        this.requesting = true;
        getBars({ symbolInfo: symbolInfo, resolution: resolution, from: from, to: to, firstDataRequest: firstDataRequest })
            .then(function (data) {
            _this.requesting = false;
            onHistoryCallback(data.bars, data.meta);
        })
            .catch(function () {
            _this.requesting = false;
            onErrorCallback("Error getBars");
        });
    };
    /**
     * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
     */
    DataFeed.prototype.subscribeBars = function (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        if (this.subscribers[subscriberUID]) {
            return;
        }
        this.subscribers[subscriberUID] = {
            lastBarTime: null,
            listener: onRealtimeCallback,
            resolution: resolution,
            symbolInfo: symbolInfo,
        };
    };
    /**
     * 取消订阅K线数据
     */
    DataFeed.prototype.unsubscribeBars = function (subscriberUID) {
        if (!this.subscribers[subscriberUID]) {
            return;
        }
        delete this.subscribers[subscriberUID];
    };
    DataFeed.prototype.updateKLine = function (bar) {
        for (var listenerGuid in this.subscribers) {
            var subscriptionRecord = this.subscribers[listenerGuid];
            if (subscriptionRecord.lastBarTime !== null &&
                bar.time < subscriptionRecord.lastBarTime) {
                continue;
            }
            subscriptionRecord.lastBarTime = bar.time;
            subscriptionRecord.listener(bar);
        }
    };
    /**
     * 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度
     */
    DataFeed.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
        var calculateHistoryDepth = this.options.calculateHistoryDepth;
        if (!calculateHistoryDepth) {
            return;
        }
        return calculateHistoryDepth(resolution, resolutionBack, intervalBack);
    };
    /**
     * 图表库调用这个函数来获得可见的K线范围的标记
     */
    DataFeed.prototype.getMarks = function (symbolInfo, startDate, endDate, onDataCallback, resolution) {
        var getMarks = this.options.getMarks;
        if (!getMarks) {
            return;
        }
        getMarks({ symbolInfo: symbolInfo, startDate: startDate, endDate: endDate, resolution: resolution }).then(onDataCallback);
    };
    /**
     * 图表库调用此函数获取可见K线范围的时间刻度标记
     */
    DataFeed.prototype.getTimescaleMarks = function (symbolInfo, startDate, endDate, onDataCallback, resolution) {
        var getTimescaleMarks = this.options.getTimescaleMarks;
        var supports_timescale_marks = this.configuration.supports_timescale_marks;
        if (!getTimescaleMarks || !supports_timescale_marks) {
            return;
        }
        getTimescaleMarks({ symbolInfo: symbolInfo, startDate: startDate, endDate: endDate, resolution: resolution }).then(onDataCallback);
    };
    /**
     * 当图表需要知道服务器时间时，如果配置标志supports_time设置为true，则调用此函数
     */
    DataFeed.prototype.getServerTime = function (callback) {
        var getServerTime = this.options.getServerTime;
        var supports_time = this.configuration.supports_time;
        if (!getServerTime || !supports_time) {
            return;
        }
        getServerTime().then(callback);
    };
    DataFeed.prototype.defaultConfiguration = function () {
        return {
            supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
            supports_marks: false,
            supports_timescale_marks: false,
        };
    };
    return DataFeed;
}());
exports.DataFeed = DataFeed;

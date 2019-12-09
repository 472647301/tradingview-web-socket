"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var history_provider_1 = require("./history-provider");
var data_pulse_provider_1 = require("./data-pulse-provider");
var quotes_pulse_provider_1 = require("./quotes-pulse-provider");
var symbols_storage_1 = require("./symbols-storage");
function extractField(data, field, arrayIndex) {
    var value = data[field];
    return Array.isArray(value) ? value[arrayIndex] : value;
}
/**
 * This class implements interaction with UDF-compatible datafeed.
 * See UDF protocol reference at https://github.com/tradingview/charting_library/wiki/UDF
 */
var UDFCompatibleDatafeed = /** @class */ (function () {
    function UDFCompatibleDatafeed(datafeedURL, quotesProvider, requester, updateFrequency) {
        var _this = this;
        if (updateFrequency === void 0) { updateFrequency = 10 * 1000; }
        this._configuration = defaultConfiguration();
        this._symbolsStorage = null;
        this._datafeedURL = datafeedURL;
        this._requester = requester;
        this._historyProvider = new history_provider_1.HistoryProvider(datafeedURL, this._requester);
        this._quotesProvider = quotesProvider;
        this._dataPulseProvider = new data_pulse_provider_1.DataPulseProvider(this._historyProvider, updateFrequency);
        this._quotesPulseProvider = new quotes_pulse_provider_1.QuotesPulseProvider(this._quotesProvider);
        this._configurationReadyPromise = this._requestConfiguration().then(function (configuration) {
            if (configuration === null) {
                configuration = defaultConfiguration();
            }
            _this._setupWithConfiguration(configuration);
        });
    }
    UDFCompatibleDatafeed.prototype.updateData = function (data) {
        this._dataPulseProvider._updateData(data);
    };
    UDFCompatibleDatafeed.prototype.onReady = function (callback) {
        var _this = this;
        this._configurationReadyPromise.then(function () {
            callback(_this._configuration);
        });
    };
    UDFCompatibleDatafeed.prototype.getQuotes = function (symbols, onDataCallback, onErrorCallback) {
        this._quotesProvider
            .getQuotes(symbols)
            .then(onDataCallback)
            .catch(onErrorCallback);
    };
    UDFCompatibleDatafeed.prototype.subscribeQuotes = function (symbols, fastSymbols, onRealtimeCallback, listenerGuid) {
        this._quotesPulseProvider.subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGuid);
    };
    UDFCompatibleDatafeed.prototype.unsubscribeQuotes = function (listenerGuid) {
        this._quotesPulseProvider.unsubscribeQuotes(listenerGuid);
    };
    UDFCompatibleDatafeed.prototype.calculateHistoryDepth = function (resolution, resolutionBack, intervalBack) {
        return undefined;
    };
    UDFCompatibleDatafeed.prototype.getMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
        if (!this._configuration.supports_marks) {
            return;
        }
        var requestParams = {
            symbol: symbolInfo.ticker || "",
            from: from,
            to: to,
            resolution: resolution
        };
        this._send("marks", requestParams)
            .then(function (response) {
            if (!Array.isArray(response)) {
                var result = [];
                for (var i = 0; i < response.id.length; ++i) {
                    result.push({
                        id: extractField(response, "id", i),
                        time: extractField(response, "time", i),
                        color: extractField(response, "color", i),
                        text: extractField(response, "text", i),
                        label: extractField(response, "label", i),
                        labelFontColor: extractField(response, "labelFontColor", i),
                        minSize: extractField(response, "minSize", i)
                    });
                }
                response = result;
            }
            onDataCallback(response);
        })
            .catch(function (error) {
            helpers_1.logMessage("UdfCompatibleDatafeed: Request marks failed: " + helpers_1.getErrorMessage(error));
            onDataCallback([]);
        });
    };
    UDFCompatibleDatafeed.prototype.getTimescaleMarks = function (symbolInfo, from, to, onDataCallback, resolution) {
        if (!this._configuration.supports_timescale_marks) {
            return;
        }
        var requestParams = {
            symbol: symbolInfo.ticker || "",
            from: from,
            to: to,
            resolution: resolution
        };
        this._send("timescale_marks", requestParams)
            .then(function (response) {
            if (!Array.isArray(response)) {
                var result = [];
                for (var i = 0; i < response.id.length; ++i) {
                    result.push({
                        id: extractField(response, "id", i),
                        time: extractField(response, "time", i),
                        color: extractField(response, "color", i),
                        label: extractField(response, "label", i),
                        tooltip: extractField(response, "tooltip", i)
                    });
                }
                response = result;
            }
            onDataCallback(response);
        })
            .catch(function (error) {
            helpers_1.logMessage("UdfCompatibleDatafeed: Request timescale marks failed: " + helpers_1.getErrorMessage(error));
            onDataCallback([]);
        });
    };
    UDFCompatibleDatafeed.prototype.getServerTime = function (callback) {
        if (!this._configuration.supports_time) {
            return;
        }
        this._send("time")
            .then(function (response) {
            var time = parseInt(response);
            if (!isNaN(time)) {
                callback(time);
            }
        })
            .catch(function (error) {
            helpers_1.logMessage("UdfCompatibleDatafeed: Fail to load server time, error=" + helpers_1.getErrorMessage(error));
        });
    };
    UDFCompatibleDatafeed.prototype.searchSymbols = function (userInput, exchange, symbolType, onResult) {
        if (this._configuration.supports_search) {
            var params = {
                limit: 30 /* SearchItemsLimit */,
                query: userInput.toUpperCase(),
                type: symbolType,
                exchange: exchange
            };
            this._send("search", params)
                .then(function (response) {
                if (response.s !== undefined) {
                    helpers_1.logMessage("UdfCompatibleDatafeed: search symbols error=" + response.errmsg);
                    onResult([]);
                    return;
                }
                onResult(response);
            })
                .catch(function (reason) {
                helpers_1.logMessage("UdfCompatibleDatafeed: Search symbols for '" + userInput + "' failed. Error=" + helpers_1.getErrorMessage(reason));
                onResult([]);
            });
        }
        else {
            if (this._symbolsStorage === null) {
                throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");
            }
            this._symbolsStorage
                .searchSymbols(userInput, exchange, symbolType, 30 /* SearchItemsLimit */)
                .then(onResult)
                .catch(onResult.bind(null, []));
        }
    };
    UDFCompatibleDatafeed.prototype.resolveSymbol = function (symbolName, onResolve, onError) {
        helpers_1.logMessage("Resolve requested");
        var resolveRequestStartTime = Date.now();
        function onResultReady(symbolInfo) {
            helpers_1.logMessage("Symbol resolved: " + (Date.now() - resolveRequestStartTime) + "ms");
            onResolve(symbolInfo);
        }
        if (!this._configuration.supports_group_request) {
            var params = {
                symbol: symbolName
            };
            this._send("symbols", params)
                .then(function (response) {
                if (response.s !== undefined) {
                    onError("unknown_symbol");
                }
                else {
                    onResultReady(response);
                }
            })
                .catch(function (reason) {
                helpers_1.logMessage("UdfCompatibleDatafeed: Error resolving symbol: " + helpers_1.getErrorMessage(reason));
                onError("unknown_symbol");
            });
        }
        else {
            if (this._symbolsStorage === null) {
                throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");
            }
            this._symbolsStorage
                .resolveSymbol(symbolName)
                .then(onResultReady)
                .catch(onError);
        }
    };
    UDFCompatibleDatafeed.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, onResult, onError, firstDataRequest // 标识是否第一次调用此商品/周期的历史记录
    ) {
        this._historyProvider
            .getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest)
            .then(function (result) {
            onResult(result.bars, result.meta);
        })
            .catch(onError);
    };
    UDFCompatibleDatafeed.prototype.subscribeBars = function (symbolInfo, resolution, onTick, listenerGuid, onResetCacheNeededCallback) {
        this._dataPulseProvider.subscribeBars(symbolInfo, resolution, onTick, listenerGuid);
    };
    UDFCompatibleDatafeed.prototype.unsubscribeBars = function (listenerGuid) {
        this._dataPulseProvider.unsubscribeBars(listenerGuid);
    };
    UDFCompatibleDatafeed.prototype._requestConfiguration = function () {
        return this._send("config")
            .then(function (data) { return data; })
            .catch(function (reason) {
            helpers_1.logMessage("UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error=" + helpers_1.getErrorMessage(reason));
            return null;
        });
    };
    UDFCompatibleDatafeed.prototype._send = function (urlPath, params) {
        return this._requester.sendRequest(this._datafeedURL, urlPath, params);
    };
    UDFCompatibleDatafeed.prototype._setupWithConfiguration = function (configurationData) {
        this._configuration = configurationData;
        if (configurationData.exchanges === undefined) {
            configurationData.exchanges = [];
        }
        if (!configurationData.supports_search &&
            !configurationData.supports_group_request) {
            throw new Error("Unsupported datafeed configuration. Must either support search, or support group request");
        }
        if (configurationData.supports_group_request ||
            !configurationData.supports_search) {
            this._symbolsStorage = new symbols_storage_1.SymbolsStorage(this._datafeedURL, configurationData.supported_resolutions || [], this._requester);
        }
        helpers_1.logMessage("UdfCompatibleDatafeed: Initialized with " + JSON.stringify(configurationData));
    };
    return UDFCompatibleDatafeed;
}());
exports.UDFCompatibleDatafeed = UDFCompatibleDatafeed;
function defaultConfiguration() {
    return {
        supports_search: false,
        supports_group_request: true,
        supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        supports_marks: false,
        supports_timescale_marks: false
    };
}

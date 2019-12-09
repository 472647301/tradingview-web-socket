"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var HistoryProvider = /** @class */ (function () {
    function HistoryProvider(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    HistoryProvider.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest) {
        var _this = this;
        var requestParams = {
            symbol: symbolInfo.ticker || "",
            resolution: resolution,
            from: rangeStartDate,
            to: rangeEndDate,
            firstDataRequest: firstDataRequest
        };
        return new Promise(function (resolve, reject) {
            _this._requester
                .sendRequest(_this._datafeedUrl, "history", requestParams)
                .then(function (response) {
                resolve({
                    bars: response.bars,
                    meta: response.meta
                });
            })
                .catch(function (reason) {
                var reasonString = helpers_1.getErrorMessage(reason);
                // tslint:disable-next-line:no-console
                console.warn("HistoryProvider: getBars() failed, error=" + reasonString);
                reject(reasonString);
            });
        });
    };
    return HistoryProvider;
}());
exports.HistoryProvider = HistoryProvider;

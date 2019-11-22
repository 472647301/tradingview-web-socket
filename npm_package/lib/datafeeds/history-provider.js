"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var HistoryProvider = /** @class */ (function () {
    function HistoryProvider(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    HistoryProvider.prototype.getBars = function (symbolInfo, resolution, rangeStartDate, rangeEndDate) {
        var _this = this;
        var requestParams = {
            symbol: symbolInfo.ticker || "",
            resolution: resolution,
            from: rangeStartDate,
            to: rangeEndDate
        };
        return new Promise(function (resolve, reject) {
            _this._requester
                .sendRequest(_this._datafeedUrl, "history", requestParams)
                .then(function (response) {
                // if (response.s !== "ok" && response.s !== "no_data") {
                //   reject(response.errmsg);
                //   return;
                // }
                // const bars: Bar[] = [];
                // const meta: HistoryMetadata = {
                //   noData: false
                // };
                // if (response.s === "no_data") {
                //   meta.noData = true;
                //   meta.nextTime = response.nextTime;
                // } else {
                //   const volumePresent = response.v !== undefined;
                //   const ohlPresent = response.o !== undefined;
                //   for (let i = 0; i < response.t.length; ++i) {
                //     const barValue: Bar = {
                //       time: response.t[i] * 1000,
                //       close: Number(response.c[i]),
                //       open: Number(response.c[i]),
                //       high: Number(response.c[i]),
                //       low: Number(response.c[i])
                //     };
                //     if (ohlPresent) {
                //       barValue.open = Number(
                //         (response as HistoryFullDataResponse).o[i]
                //       );
                //       barValue.high = Number(
                //         (response as HistoryFullDataResponse).h[i]
                //       );
                //       barValue.low = Number(
                //         (response as HistoryFullDataResponse).l[i]
                //       );
                //     }
                //     if (volumePresent) {
                //       barValue.volume = Number(
                //         (response as HistoryFullDataResponse).v[i]
                //       );
                //     }
                //     bars.push(barValue);
                //   }
                // }
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

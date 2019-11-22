"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var udf_compatible_datafeed_base_1 = require("./udf-compatible-datafeed-base");
var quotes_provider_1 = require("./quotes-provider");
var requester_1 = require("./requester");
var UDFCompatibleDatafeed = /** @class */ (function (_super) {
    __extends(UDFCompatibleDatafeed, _super);
    function UDFCompatibleDatafeed(datafeedURL, options) {
        var _this = this;
        var requester = new requester_1.Requester();
        var quotesProvider = new quotes_provider_1.QuotesProvider(datafeedURL, requester);
        _this = _super.call(this, datafeedURL, quotesProvider, requester, undefined, options) || this;
        return _this;
    }
    return UDFCompatibleDatafeed;
}(udf_compatible_datafeed_base_1.UDFCompatibleDatafeedBase));
exports.UDFCompatibleDatafeed = UDFCompatibleDatafeed;

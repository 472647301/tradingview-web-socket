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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _TradingView = __importStar(require("charting_library"));
var udf_compatible_datafeed_1 = require("./datafeeds/udf-compatible-datafeed");
var quotes_provider_1 = require("./datafeeds/quotes-provider");
var requester_1 = require("./datafeeds/requester");
var Datafeed = /** @class */ (function (_super) {
    __extends(Datafeed, _super);
    function Datafeed(options, datafeedURL) {
        if (datafeedURL === void 0) { datafeedURL = ""; }
        var _this = this;
        var requester = new requester_1.Requester(options);
        var quotesProvider = new quotes_provider_1.QuotesProvider(datafeedURL, requester);
        _this = _super.call(this, datafeedURL, quotesProvider, requester, undefined) || this;
        return _this;
    }
    return Datafeed;
}(udf_compatible_datafeed_1.UDFCompatibleDatafeed));
exports.Datafeed = Datafeed;
var TradingView = /** @class */ (function (_super) {
    __extends(TradingView, _super);
    function TradingView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TradingView;
}(_TradingView.widget));
exports.TradingView = TradingView;

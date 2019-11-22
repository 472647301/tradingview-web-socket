"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var Requester = /** @class */ (function () {
    function Requester(options, headers) {
        this.options = {};
        if (headers) {
            this._headers = headers;
        }
        this.options = options;
    }
    Requester.prototype.sendRequest = function (datafeedUrl, urlPath, params) {
        if (this.options[urlPath]) {
            return this.options[urlPath](params).then(function (res) { return res; });
        }
        if (params !== undefined) {
            var paramKeys = Object.keys(params);
            if (paramKeys.length !== 0) {
                urlPath += "?";
            }
            urlPath += paramKeys
                .map(function (key) {
                return encodeURIComponent(key) + "=" + encodeURIComponent(params[key].toString());
            })
                .join("&");
        }
        helpers_1.logMessage("New request: " + urlPath);
        // Send user cookies if the URL is on the same origin as the calling script.
        var options = { credentials: "same-origin" };
        if (this._headers !== undefined) {
            options.headers = this._headers;
        }
        return fetch(datafeedUrl + "/" + urlPath, options)
            .then(function (response) { return response.text(); })
            .then(function (responseTest) { return JSON.parse(responseTest); });
    };
    return Requester;
}());
exports.Requester = Requester;

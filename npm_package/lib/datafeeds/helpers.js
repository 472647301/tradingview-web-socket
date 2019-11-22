"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * If you want to enable logs from datafeed set it to `true`
 */
var isLoggingEnabled = false;
function logMessage(message) {
    if (isLoggingEnabled) {
        var now = new Date();
        // tslint:disable-next-line:no-console
        console.log(now.toLocaleTimeString() + "." + now.getMilliseconds() + "> " + message);
    }
}
exports.logMessage = logMessage;
function getErrorMessage(error) {
    if (error === undefined) {
        return "";
    }
    else if (typeof error === "string") {
        return error;
    }
    return error.message;
}
exports.getErrorMessage = getErrorMessage;

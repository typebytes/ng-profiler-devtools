"use strict";
exports.__esModule = true;
var zone_handler_1 = require("./zone-handler");
function sendMessage(message) {
    zone_handler_1.scheduleOutsideOfZone(function () { return window.postMessage({
        message: message,
        source: 'ngProfilerDevtoolsInjectedScript'
    }, '*'); });
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=messaging.js.map
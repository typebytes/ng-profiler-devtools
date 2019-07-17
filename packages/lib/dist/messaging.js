"use strict";
exports.__esModule = true;
function sendMessage(message) {
    window.postMessage({
        message: message,
        source: 'ngProfilerDevtoolsInjectedScript'
    }, '*');
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=messaging.js.map
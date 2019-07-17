"use strict";
exports.__esModule = true;
function scheduleOutsideOfZone(scheduledFn) {
    Zone.root.run(function () { return new Promise(function (r) { return r(); }).then(function () { return scheduledFn(); }); });
}
exports.scheduleOutsideOfZone = scheduleOutsideOfZone;
//# sourceMappingURL=zone-handler.js.map
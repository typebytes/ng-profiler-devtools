"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var util_1 = require("./util");
var devtool_1 = require("./devtool");
var angular_core_1 = require("./types/angular_core");
__export(require("./tree-view-builder"));
__export(require("./visualisation"));
function startTracing() {
    setTimeout(function () {
        var angularRootNode = util_1.findAngularRootNode(document.body);
        if (angularRootNode) {
            devtool_1.monkeyPatchRootNode(angularRootNode[angular_core_1.CONTEXT]);
        }
    }, 2000);
}
exports.startTracing = startTracing;
function stopTracing() {
    devtool_1.undoMonkeyPatch();
}
exports.stopTracing = stopTracing;
function isAngularApp() {
    console.log('trying to find angular root node', util_1.findAngularRootNode(document.body));
    return util_1.findAngularRootNode(document.body) !== undefined;
}
exports.isAngularApp = isAngularApp;
//# sourceMappingURL=index.js.map
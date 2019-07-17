"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var angular_core_1 = require("./types/angular_core");
function monkeyPatchFunction(obj, property, monkeyPatchFn) {
    obj[property] = monkeyPatchFn;
}
exports.monkeyPatchFunction = monkeyPatchFunction;
function getComponentViewByIndex(nodeIndex, hostView) {
    // Could be an LView or an LContainer. If LContainer, unwrap to find LView.
    var slotValue = hostView[nodeIndex];
    var lView = isLView(slotValue) ? slotValue : slotValue[angular_core_1.HOST];
    return lView;
}
exports.getComponentViewByIndex = getComponentViewByIndex;
function isLView(value) {
    return Array.isArray(value) && typeof value[angular_core_1.TYPE] === 'object';
}
exports.isLView = isLView;
function isLContainer(value) {
    return Array.isArray(value) && value[angular_core_1.TYPE] === true;
}
exports.isLContainer = isLContainer;
function readPatchedData(target) {
    return target[angular_core_1.MONKEY_PATCH_KEY_NAME];
}
exports.readPatchedData = readPatchedData;
function readPatchedLView(target) {
    var value = readPatchedData(target);
    if (value) {
        return Array.isArray(value) ? value : value.lView;
    }
    return null;
}
exports.readPatchedLView = readPatchedLView;
function isCreationMode(view) {
    return (view[angular_core_1.FLAGS] & 4 /* CreationMode */) === 4 /* CreationMode */;
}
exports.isCreationMode = isCreationMode;
function viewAttachedToChangeDetector(view) {
    return (view[angular_core_1.FLAGS] & 128 /* Attached */) === 128 /* Attached */;
}
function shouldLViewBeChecked(lView) {
    return ((viewAttachedToChangeDetector(lView) || isCreationMode(lView)) &&
        (lView[angular_core_1.FLAGS] & (16 /* CheckAlways */ | 64 /* Dirty */)) === 0);
}
exports.shouldLViewBeChecked = shouldLViewBeChecked;
function findAngularRootNode(node) {
    if (!node || !node.childNodes) {
        return;
    }
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        if (childNode[angular_core_1.MONKEY_PATCH_KEY_NAME]) {
            return childNode[angular_core_1.MONKEY_PATCH_KEY_NAME];
        }
        else {
            var potentialRootNode = findAngularRootNode(childNode);
            if (potentialRootNode) {
                return potentialRootNode;
            }
        }
    }
}
exports.findAngularRootNode = findAngularRootNode;
function mapToObject(map) {
    var e_1, _a;
    var obj = {};
    try {
        for (var map_1 = __values(map), map_1_1 = map_1.next(); !map_1_1.done; map_1_1 = map_1.next()) {
            var _b = __read(map_1_1.value, 2), key = _b[0], value = _b[1];
            obj[key] = value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (map_1_1 && !map_1_1.done && (_a = map_1["return"])) _a.call(map_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return obj;
}
exports.mapToObject = mapToObject;
//# sourceMappingURL=util.js.map
"use strict";
exports.__esModule = true;
var angular_core_1 = require("./types/angular_core");
var constants_1 = require("./constants");
var TreeViewBuilder = /** @class */ (function () {
    function TreeViewBuilder() {
    }
    TreeViewBuilder.prototype.addTreeViewItem = function (childTreeViewItem, parentTreeViewItem) {
        if (!parentTreeViewItem) {
            this.rootTreeViewItem = childTreeViewItem;
            this.currentTreeViewItem = this.rootTreeViewItem;
        }
        else {
            parentTreeViewItem.children.push(childTreeViewItem);
            this.currentTreeViewItem = childTreeViewItem;
        }
    };
    return TreeViewBuilder;
}());
exports.TreeViewBuilder = TreeViewBuilder;
function serialiseTreeViewItem(treeViewItem) {
    return {
        uuid: treeViewItem.lView[angular_core_1.HOST][constants_1.DEVTOOLS_IDENTIFIER],
        children: treeViewItem.children.map(function (loopTreeViewItem) {
            return serialiseTreeViewItem(loopTreeViewItem);
        }),
        tagName: treeViewItem.lView[0].tagName,
        onPush: (treeViewItem.lView[angular_core_1.FLAGS] & 16 /* CheckAlways */) === 0
    };
}
exports.serialiseTreeViewItem = serialiseTreeViewItem;
function createInitialTreeViewState(lView, isRoot, parent) {
    return {
        lView: lView,
        currentIndex: 0,
        children: [],
        isRoot: isRoot,
        parent: parent
    };
}
exports.createInitialTreeViewState = createInitialTreeViewState;
//# sourceMappingURL=tree-view-builder.js.map
"use strict";
exports.__esModule = true;
var angular_core_1 = require("./types/angular_core");
var util_1 = require("./util");
var tree_view_builder_1 = require("./tree-view-builder");
var uuid = require("uuid");
var constants_1 = require("./constants");
function loopDynamicEmbeddedViews(_a) {
    var lView = _a.lView, work = _a.work, nextCurrentLContainer = _a.nextCurrentLContainer, nextViewRefIndex = _a.nextViewRefIndex, _b = _a.exitLoopPrematurely, exitLoopPrematurely = _b === void 0 ? false : _b;
    var viewOrContainer = nextCurrentLContainer !== undefined ? nextCurrentLContainer : lView[angular_core_1.CHILD_HEAD];
    while (viewOrContainer !== null) {
        if (util_1.isLContainer(viewOrContainer) && viewOrContainer[angular_core_1.ACTIVE_INDEX] === -1) {
            for (var i = nextViewRefIndex || angular_core_1.CONTAINER_HEADER_OFFSET; i < viewOrContainer.length; i++) {
                var embeddedLView = viewOrContainer[i];
                work(embeddedLView, i === viewOrContainer[angular_core_1.VIEW_REFS].length - 1, i, viewOrContainer[angular_core_1.NEXT]);
                if (exitLoopPrematurely) {
                    return true;
                }
            }
        }
        viewOrContainer = viewOrContainer[angular_core_1.NEXT];
    }
    // for (
    // 	let current: LContainer =
    // 		nextCurrentLContainer !== undefined
    // 			? nextCurrentLContainer
    // 			: lView[CHILD_HEAD];
    // 	current !== null;
    // 	current = current[NEXT]
    // ) {
    // 	if (current.length < HEADER_OFFSET && current[ACTIVE_INDEX] === -1) {
    // 		for (
    // 			let i = nextViewRefIndex ? nextViewRefIndex : 0;
    // 			i < current[VIEW_REFS].length;
    // 			i++
    // 		) {
    // 			const dynamicViewData = current[VIEW_REFS][i];
    // 			work(
    // 				dynamicViewData,
    // 				i === current[VIEW_REFS].length - 1,
    // 				i,
    // 				current[NEXT]
    // 			);
    // 			if (exitLoopPrematurely) {
    // 				return true;
    // 			}
    // 		}
    // 	}
    // }
    return false;
}
exports.loopDynamicEmbeddedViews = loopDynamicEmbeddedViews;
function loopChildComponents(_a) {
    var lView = _a.lView, work = _a.work, exitLoopPrematurely = _a.exitLoopPrematurely;
    var tView = lView[angular_core_1.TVIEW];
    if (tView.components != null) {
        for (var i = 0; i < tView.components.length; i++) {
            var childLView = util_1.getComponentViewByIndex(tView.components[i], lView);
            work(childLView);
            if (exitLoopPrematurely) {
                return true;
            }
        }
    }
    return false;
}
exports.loopChildComponents = loopChildComponents;
function traverseTreeAndCreateTreeStructure(rootLView, isRoot) {
    var addElement = function (treeViewItem, parentTreeViewItem) { return parentTreeViewItem.children.push(treeViewItem); };
    return traverseTreeToStructure(addElement)(rootLView, isRoot);
}
exports.traverseTreeAndCreateTreeStructure = traverseTreeAndCreateTreeStructure;
function traverseTreeAndCreateInstructions(rootLView, isRoot) {
    var instructions = [];
    var addElement = function (treeViewItem) {
        return instructions.push(treeViewItem);
    };
    return traverseTreeToStructure(addElement, instructions)(rootLView, isRoot);
}
exports.traverseTreeAndCreateInstructions = traverseTreeAndCreateInstructions;
var traverseTreeToStructure = function (addElement, accumulator) {
    return function traverseTree(lView, isRoot, parentTreeViewItem) {
        var treeViewItem = tree_view_builder_1.createInitialTreeViewState(lView, isRoot, parentTreeViewItem);
        // Only when the lView has a host element do we want to add it, otherwise it's a dynamicEmbeddedView
        if (lView[angular_core_1.HOST] && !isRoot) {
            // If there is a parentTreeViewItem, it means that the currentTreeViewItem was a dynamic one, so we add it to the parent
            addElement(treeViewItem, parentTreeViewItem);
        }
        var whenDynamicEmbeddedViewFound = function (dynamicLView) {
            traverseTree(dynamicLView, false, treeViewItem.lView[angular_core_1.HOST] ? treeViewItem : parentTreeViewItem);
        };
        loopDynamicEmbeddedViews({
            lView: lView,
            work: whenDynamicEmbeddedViewFound
        });
        var whenChildComponentFound = function (childLView) {
            if (!childLView[angular_core_1.HOST][constants_1.DEVTOOLS_IDENTIFIER]) {
                childLView[angular_core_1.HOST][constants_1.DEVTOOLS_IDENTIFIER] = uuid();
            }
            traverseTree(childLView, false, treeViewItem.lView[angular_core_1.HOST] ? treeViewItem : parentTreeViewItem);
        };
        loopChildComponents({ lView: lView, work: whenChildComponentFound });
        if (isRoot) {
            return accumulator ? accumulator : treeViewItem;
        }
    };
};
function transformTreeToInstructions(inputTreeViewItem) {
    var instructions = new Map();
    var walkTree = function (treeViewItem) {
        instructions.set(treeViewItem.uuid, treeViewItem);
        treeViewItem.children.forEach(function (childTreeViewItem) {
            return walkTree(childTreeViewItem);
        });
    };
    walkTree(inputTreeViewItem);
    return instructions;
}
exports.transformTreeToInstructions = transformTreeToInstructions;
// Because of dynamicEmbeddedViews and because we need to be able to walk the tree, some elements are added as parents which aren't
// components, we need to filter those out
function getRealParent(treeViewItem) {
    if (treeViewItem.lView[angular_core_1.HOST]) {
        return treeViewItem;
    }
    else {
        return getRealParent(treeViewItem.parent);
    }
}
exports.getRealParent = getRealParent;
//# sourceMappingURL=tree-traversal.js.map
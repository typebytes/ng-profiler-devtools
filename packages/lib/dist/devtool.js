"use strict";
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var angular_core_1 = require("./types/angular_core");
var tracing_1 = require("./visualisation/tracing");
var l_view_state_manager_1 = require("./l-view-state-manager");
var util_1 = require("./util");
var tree_traversal_1 = require("./tree-traversal");
var zone_handler_1 = require("./zone-handler");
var graph_1 = require("./visualisation/graph");
var uuid = require("uuid");
var constants_1 = require("./constants");
var tree_view_builder_1 = require("./tree-view-builder");
var tracer = new tracing_1.Tracer();
var treeGraph = new graph_1.GraphRender('liveTree');
var lViewStateManager = new l_view_state_manager_1.LViewStateManager();
var patchedTemplateFns = [];
// In dev mode, there will be two cycles. The second cycle is purely used for making sure the unidirectional data flow is followed and
// should not be visualised. We opt to not track this second cycle.
var cdCycleCountInCurrentLoop = 0;
var monkeyPatchTemplate = function (tView, rootLView) {
    if (tView.template.__template_patched__) {
        return;
    }
    var origTemplate = tView.template;
    tView.template = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log(rootLView, args[0], cdCycleCountInCurrentLoop);
        if (rootLView) {
            cdCycleCountInCurrentLoop++;
        }
        // Mode will be 1 for creation and 2 for update
        var mode = args[0];
        // Don't get the next lView if we are in creation mode as it will be called immediately in update mode
        if (mode === 1 || cdCycleCountInCurrentLoop !== 1) {
            console.log('short circuiting');
            origTemplate.apply(void 0, __spread(args));
            return;
        }
        if (rootLView) {
            // If we have the rootLView, it means that we have started a new cycle
            lViewStateManager.resetState();
            console.log('scheduled!');
            zone_handler_1.scheduleOutsideOfZone(function () {
                cdCycleCountInCurrentLoop = 0;
                var updatedTree = tree_view_builder_1.serialiseTreeViewItem(lViewStateManager.getTree());
                var entireTree = tree_view_builder_1.serialiseTreeViewItem(tree_traversal_1.traverseTreeAndCreateTreeStructure(rootLView, true));
                var updatedTreeAsInstructions = tree_traversal_1.transformTreeToInstructions(updatedTree);
                // treeGraph.setUpdates(entireTree, updatedTreeAsInstructions);
                // renderTree('lastUpdatedTree', entireTree, updatedTreeAsInstructions);
                // const events = new CustomEvent('PassToBackground', {detail: message});
                // sendMessage({
                // 	type: 'ENTIRE_TREE',
                // 	payload: {entireTree, instructions: mapToObject(updatedTreeAsInstructions)}
                // });
                // sendMessage({
                // 	type: 'UPDATED_TREE',
                // 	payload: {updatedTree}
                // });
                // window.postMessage('whatever', '*');
                window.dispatchEvent(new CustomEvent('ContentScriptEvent', {
                    detail: {
                        type: 'ENTIRE_TREE',
                        payload: { entireTree: entireTree, instructions: util_1.mapToObject(updatedTreeAsInstructions) }
                    }
                }));
                console.log('updatedTree', updatedTree);
                window.dispatchEvent(new CustomEvent('ContentScriptEvent', {
                    detail: {
                        type: 'UPDATED_TREE',
                        payload: { updatedTree: updatedTree }
                    }
                }));
            });
        }
        // Set the pointer to the next lView
        lViewStateManager.getNextLView(null, rootLView);
        var currentLView = lViewStateManager.predictedNextLView;
        // console.log('CD for ', currentLView[HOST].tagName);
        if (!currentLView[angular_core_1.HOST][constants_1.DEVTOOLS_IDENTIFIER]) {
            currentLView[angular_core_1.HOST][constants_1.DEVTOOLS_IDENTIFIER] = uuid();
        }
        origTemplate.apply(void 0, __spread(args));
        // After executing the template, we need to check if components were added
        // TODO: check if we need to check child components again (prolly dynamicEmbeddedViews are enough)
        monkeyPatchDirectChildren(currentLView);
        // Lastly, we need to update the Tracer to show a box. This has to be done in a timeout as the view dimensions have not
        // been updated at this point yet.
        zone_handler_1.scheduleOutsideOfZone(function () {
            // console.log(`Tracing for ${currentLView[HOST].tagName}`, currentLView[HOST]);
            tracer.present(currentLView[angular_core_1.HOST][constants_1.DEVTOOLS_IDENTIFIER], currentLView[angular_core_1.HOST].tagName, tracing_1.createMeasurement(currentLView[0].getBoundingClientRect()));
        });
    };
    tView.template.__template_patched__ = true;
    patchedTemplateFns.push({ origTemplate: origTemplate, tView: tView });
};
function monkeyPatchDirectChildren(lView, isRoot) {
    if (isRoot === void 0) { isRoot = false; }
    // Patch direct child components
    var whenChildComponentFound;
    if (isRoot) {
        whenChildComponentFound = function (childLView) {
            return monkeyPatchTemplate(childLView[angular_core_1.TVIEW], childLView);
        };
    }
    else {
        whenChildComponentFound = function (childLView) {
            return monkeyPatchTemplate(childLView[angular_core_1.TVIEW]);
        };
    }
    tree_traversal_1.loopChildComponents({ lView: lView, work: whenChildComponentFound });
    // Find components in the dynamicEmbeddedViews to patch
    var whenDynamicEmbeddedViewFound = function (dynamicLView) {
        if (dynamicLView[angular_core_1.HOST]) {
            monkeyPatchTemplate(dynamicLView[angular_core_1.TVIEW]);
        }
        monkeyPatchDirectChildren(dynamicLView);
    };
    tree_traversal_1.loopDynamicEmbeddedViews({ lView: lView, work: whenDynamicEmbeddedViewFound });
}
exports.monkeyPatchDirectChildren = monkeyPatchDirectChildren;
function monkeyPatchRootNode(rootContext) {
    for (var i = 0; i < rootContext.components.length; i++) {
        var rootComponent = rootContext.components[i];
        var rootComponentLView = util_1.readPatchedLView(rootComponent);
        monkeyPatchDirectChildren(rootComponentLView, true);
    }
}
exports.monkeyPatchRootNode = monkeyPatchRootNode;
function undoMonkeyPatch() {
    patchedTemplateFns.forEach(function (data) {
        data.tView.template = data.origTemplate;
    });
    patchedTemplateFns = [];
}
exports.undoMonkeyPatch = undoMonkeyPatch;
//# sourceMappingURL=devtool.js.map
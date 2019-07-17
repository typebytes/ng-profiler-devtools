"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var dagreD3 = require("dagre-d3");
var d3_selection_1 = require("d3-selection");
var d3_zoom_1 = require("d3-zoom");
var constants_1 = require("../constants");
var update_pool_manager_1 = require("./update-pool-manager");
/**
 * Renders a tree
 *
 * @param id - selector of the id in the html
 * @param treeViewItem - the item to visualise
 * @param updates - Map of all items that need to be highlighted
 */
function renderTree(id, treeViewItem, updates) {
    // Create the input graph
    var g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () {
        return {};
    });
    walkTreeAndAddNodes(g, treeViewItem, updates);
    var svg = d3_selection_1.select("svg#" + id), inner = svg.select('g');
    var firstRender = inner.node().children.length === 0;
    var zoom = d3_zoom_1.zoom().on('zoom', function () {
        inner.attr('transform', d3_selection_1.event.transform);
    });
    svg.call(zoom);
    var render = new dagreD3.render();
    render(inner, g);
    if (firstRender) {
        zoomFit(svg, inner, zoom);
    }
}
exports.renderTree = renderTree;
function zoomFit(root, inner, zoom) {
    var bounds = root.node().getBBox();
    var parent = root.node().parentElement;
    var fullWidth = parent.clientWidth, fullHeight = parent.clientHeight;
    var width = bounds.width, height = bounds.height;
    var midX = bounds.x + width / 2, midY = bounds.y + height / 2;
    if (width === 0 || height === 0)
        return; // nothing to fit
    var scale = 0.75 / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
    var transform = d3_zoom_1.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale);
    root
        .transition()
        .duration(0) // milliseconds
        .call(zoom.transform, transform);
}
// FIXME graph should be unaware of host and stuff
function walkTreeAndAddNodes(g, treeViewItem, updates) {
    var parentIdentifier = treeViewItem.uuid;
    if (updates && updates.has(parentIdentifier)) {
        var data = updates.get(parentIdentifier);
        g.setNode(parentIdentifier, {
            label: treeViewItem.tagName,
            "class": data.hit
                ? constants_1.COLORS_CLASSES[data.hit - 1]
                : constants_1.COLORS_CLASSES[0]
        });
    }
    else {
        g.setNode(parentIdentifier, {
            label: treeViewItem.tagName,
            "class": constants_1.NOT_UPDATED_NODE_CLASS_NAME
        });
    }
    treeViewItem.children.forEach(function (childTreeViewItem) {
        var childIdentifier = childTreeViewItem.uuid;
        walkTreeAndAddNodes(g, childTreeViewItem, updates);
        g.setEdge(parentIdentifier, childIdentifier);
    });
}
exports.walkTreeAndAddNodes = walkTreeAndAddNodes;
var GraphRender = /** @class */ (function (_super) {
    __extends(GraphRender, _super);
    function GraphRender(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    GraphRender.prototype.setUpdates = function (serializedTreeViewItem, updates) {
        this.serializedTreeViewItem = serializedTreeViewItem;
        this.addAll(updates);
    };
    GraphRender.prototype.drawImpl = function (pool) {
        renderTree(this.id, this.serializedTreeViewItem, this.pool);
    };
    return GraphRender;
}(update_pool_manager_1.UpdatePoolManager));
exports.GraphRender = GraphRender;
//# sourceMappingURL=graph.js.map
import { TreeViewItem } from '../tree-view-builder';
import * as dagreD3 from 'dagre-d3';
import { select as d3Select } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { HOST } from '../types/angular_core';
import {
	DEVTOOLS_IDENTIFIER,
	NOT_UPDATED_NODE_CLASS_NAME,
	UPDATED_NODE_CLASS_NAME
} from '../constants';
import { graphlib } from 'dagre-d3';
import Graph = graphlib.Graph;

/**
 * Renders a tree
 *
 * @param id - selector of the id in the html
 * @param treeViewItem - the item to visualise
 * @param updates - Map of all items that need to be highlighted
 */
export function renderTree(
	id: string,
	treeViewItem: TreeViewItem,
	updates?: Map<string, TreeViewItem>
) {
	// Create the input graph
	const g: Graph = new dagreD3.graphlib.Graph()
		.setGraph({})
		.setDefaultEdgeLabel(function() {
			return {};
		});

	walkTreeAndAddNodes(g, treeViewItem, updates);

	const svg = d3Select(`svg#${id}`),
		inner = svg.select('g');

	const zoom = d3Zoom().on('zoom', function() {
		// inner.attr('transform', d3Event.transform);
	});
	// svg.call(zoom);

	const render = new dagreD3.render();
	render(inner as any, g);

	const initialScale = 0.9;
	console.log(g.graph().width);
	console.log(+svg.attr('width'));
	console.log((+svg.attr('width') - g.graph().width * 0.6) / 2);
	const transform = d3ZoomIdentity
		.translate((+svg.attr('width') - g.graph().width * 0.6) / 2, 20)
		.scale(initialScale);
	(inner as any)
		.transition()
		.duration(0)
		.call(zoom.transform, transform);
	svg.attr('height', g.graph().height * initialScale + 200);
}

// FIXME graph should be unaware of host and stuff
export function walkTreeAndAddNodes(
	g: Graph,
	treeViewItem: TreeViewItem,
	updates?: Map<string, TreeViewItem>
) {
	console.log(g.nodes());
	const parentIdentifier = treeViewItem.lView[HOST][DEVTOOLS_IDENTIFIER];
	if (updates && updates.has(parentIdentifier)) {
		g.setNode(parentIdentifier, {
			label: treeViewItem.lView[HOST].tagName,
			class: UPDATED_NODE_CLASS_NAME
		});
	} else {
		g.setNode(parentIdentifier, {
			label: treeViewItem.lView[HOST].tagName,
			class: NOT_UPDATED_NODE_CLASS_NAME
		});
	}
	treeViewItem.children.forEach(childTreeViewItem => {
		const childIdentifier = childTreeViewItem.lView[HOST][DEVTOOLS_IDENTIFIER];
		walkTreeAndAddNodes(g, childTreeViewItem, updates);
		g.setEdge(parentIdentifier, childIdentifier);
	});
}

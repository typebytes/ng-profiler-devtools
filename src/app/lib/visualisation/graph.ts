import { TreeViewItem } from '../tree-view-builder';
import * as dagreD3 from 'dagre-d3';
import { event as d3Event, select as d3Select } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { HOST } from '../types/angular_core';

export function renderTree(id: string, treeViewItem: TreeViewItem) {
	console.log(id, treeViewItem);
	// Create the input graph
	const g = new dagreD3.graphlib.Graph()
		.setGraph({})
		.setDefaultEdgeLabel(function() {
			return {};
		});

	walkTreeAndAddNodes(g, treeViewItem);

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
	g,
	treeViewItem: TreeViewItem,
	data = { counter: 0 },
	counter?: number
) {
	const parentCounter = counter || data.counter++;
	const parentIdentifier = treeViewItem.lView[HOST].tagName + parentCounter;
	g.setNode(parentIdentifier, { label: treeViewItem.lView[HOST].tagName });
	treeViewItem.children.forEach(childTreeViewItem => {
		const childCounter = data.counter++;
		walkTreeAndAddNodes(g, childTreeViewItem, data, childCounter);
		g.setEdge(
			treeViewItem.lView[HOST].tagName + parentCounter,
			childTreeViewItem.lView[HOST].tagName + childCounter
		);
	});
}

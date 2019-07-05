import { TreeViewItem } from '../tree-view-builder';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
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

	// Set up an SVG group so that we can translate the final graph.
	const svg = d3.select(`svg#${id}`),
		svgGroup = svg.append('g');

	// Set up zoom support
	const zoom = d3.zoom().on('zoom', function() {
		svgGroup.attr('transform', d3.event.transform);
	});
	svg.call(zoom);

	// // Create the renderer
	const render = new dagreD3.render();

	// Run the renderer. This is what draws the final graph.
	render(d3.select(`svg#${id}`) as any, g);

	// Center the graph
	// 	const initialScale = 0.75;
	// 	svg.call(zoom.transform, d3.zoomIdentity.translate((+svg.attr('width') - g.graph().width * initialScale) / 2, 20).scale(initialScale));
	// 	svg.attr('height', g.graph().height * initialScale + 40);
	const xCenterOffset = (+svg.attr('width') - g.graph().width) / 2;
	svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
	svg.attr('height', g.graph().height + 40);
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

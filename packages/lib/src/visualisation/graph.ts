import { SerializedTreeViewItem } from '../tree-view-builder';
import * as dagreD3 from 'dagre-d3';
import { graphlib } from 'dagre-d3';
import { event as d3Event, select as d3Select } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import { COLORS_CLASSES, NOT_UPDATED_NODE_CLASS_NAME } from '../constants';
import { PoolData, UpdatePoolManager } from './update-pool-manager';
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
	treeViewItem: SerializedTreeViewItem,
	updates?: Map<
		string,
		PoolData<SerializedTreeViewItem> | SerializedTreeViewItem
	>
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
	const firstRender = (inner.node() as any).children.length === 0;

	const zoom = d3Zoom().on('zoom', function() {
		inner.attr('transform', d3Event.transform);
	});
	svg.call(zoom as any);

	const render = new dagreD3.render();
	render(inner as any, g);

	if (firstRender) {
		zoomFit(svg, inner, zoom);
	}
}

function zoomFit(root, inner, zoom) {
	var bounds = root.node().getBBox();
	var parent = root.node().parentElement;
	var fullWidth = parent.clientWidth,
		fullHeight = parent.clientHeight;
	var width = bounds.width,
		height = bounds.height;
	var midX = bounds.x + width / 2,
		midY = bounds.y + height / 2;
	if (width === 0 || height === 0) return; // nothing to fit
	var scale = 0.75 / Math.max(width / fullWidth, height / fullHeight);
	var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
	const transform = d3ZoomIdentity
		.translate(translate[0], translate[1])
		.scale(scale);
	root
		.transition()
		.duration(0) // milliseconds
		.call(zoom.transform, transform);
}

// FIXME graph should be unaware of host and stuff
export function walkTreeAndAddNodes(
	g: Graph,
	treeViewItem: SerializedTreeViewItem,
	updates?: Map<
		string,
		PoolData<SerializedTreeViewItem> | SerializedTreeViewItem
	>
) {
	const parentIdentifier = treeViewItem.uuid;
	if (updates && updates.has(parentIdentifier)) {
		const data = updates.get(parentIdentifier);
		g.setNode(parentIdentifier, {
			label: treeViewItem.tagName,
			class: (data as PoolData<SerializedTreeViewItem>).hit
				? COLORS_CLASSES[(data as PoolData<SerializedTreeViewItem>).hit - 1]
				: COLORS_CLASSES[0]
		});
	} else {
		g.setNode(parentIdentifier, {
			label: treeViewItem.tagName,
			class: NOT_UPDATED_NODE_CLASS_NAME
		});
	}
	treeViewItem.children.forEach(childTreeViewItem => {
		const childIdentifier = childTreeViewItem.uuid;
		walkTreeAndAddNodes(g, childTreeViewItem, updates);
		g.setEdge(parentIdentifier, childIdentifier);
	});
}

export class GraphRender extends UpdatePoolManager<SerializedTreeViewItem> {
	private serializedTreeViewItem: SerializedTreeViewItem;

	constructor(private id: string) {
		super();
	}

	setUpdates(
		serializedTreeViewItem: SerializedTreeViewItem,
		updates?: Map<string, SerializedTreeViewItem> | Object
	) {
		this.serializedTreeViewItem = serializedTreeViewItem;
		this.addAll(updates);
	}

	drawImpl(pool: Map<string, PoolData<SerializedTreeViewItem>>) {
		renderTree(this.id, this.serializedTreeViewItem, this.pool);
	}
}

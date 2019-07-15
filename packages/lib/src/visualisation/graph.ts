import { SerializedTreeViewItem } from '../tree-view-builder';
import * as dagreD3 from 'dagre-d3';
import { graphlib } from 'dagre-d3';
import { select as d3Select, event as d3Event } from 'd3-selection';
import { zoom as d3Zoom, zoomIdentity as d3ZoomIdentity } from 'd3-zoom';
import {
	COLORS_CLASSES,
	NOT_UPDATED_NODE_CLASS_NAME,
	UPDATED_NODE_CLASS_NAME
} from '../constants';
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

	const zoom = d3Zoom().on('zoom', function() {
		// inner.attr('transform', d3Event.transform);
	});
	// svg.call(zoom);

	const render = new dagreD3.render();
	render(inner as any, g);

	const initialScale = 0.9;
	console.log(svg.attr('width'));
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
		updates: Map<string, SerializedTreeViewItem>
	) {
		this.serializedTreeViewItem = serializedTreeViewItem;
		this.addAll(updates);
	}

	drawImpl(pool: Map<string, PoolData<SerializedTreeViewItem>>) {
		renderTree(this.id, this.serializedTreeViewItem, this.pool);
	}
}

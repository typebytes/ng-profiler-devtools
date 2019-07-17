import { SerializedTreeViewItem } from '../tree-view-builder';
import { graphlib } from 'dagre-d3';
import { PoolData, UpdatePoolManager } from './update-pool-manager';
import Graph = graphlib.Graph;
/**
 * Renders a tree
 *
 * @param id - selector of the id in the html
 * @param treeViewItem - the item to visualise
 * @param updates - Map of all items that need to be highlighted
 */
export declare function renderTree(id: string, treeViewItem: SerializedTreeViewItem, updates?: Map<string, PoolData<SerializedTreeViewItem> | SerializedTreeViewItem>): void;
export declare function walkTreeAndAddNodes(g: Graph, treeViewItem: SerializedTreeViewItem, updates?: Map<string, PoolData<SerializedTreeViewItem> | SerializedTreeViewItem>): void;
export declare class GraphRender extends UpdatePoolManager<SerializedTreeViewItem> {
    private id;
    private serializedTreeViewItem;
    constructor(id: string);
    setUpdates(serializedTreeViewItem: SerializedTreeViewItem, updates?: Map<string, SerializedTreeViewItem> | Object): void;
    drawImpl(pool: Map<string, PoolData<SerializedTreeViewItem>>): void;
}

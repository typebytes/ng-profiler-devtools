import { LView } from './types/angular_core';

export interface SerializedTreeViewItem {
	// TODO: should become a serializable identifier later
	lView: LView;
	children: SerializedTreeViewItem[];
	checked: boolean;
	onPush: boolean;
	tagName: string;
}

export interface TreeViewItem {
	lView: LView;
	currentIndex: number;
	children: TreeViewItem[];
	currentViewRefIndex?: number;
	parent?: TreeViewItem;
	isRoot: boolean;
	nextCurrent?: any;
	dynamicEmbeddedViewsChecked?: boolean;
}

export class TreeViewBuilder {
	rootTreeViewItem: TreeViewItem;
	currentTreeViewItem: TreeViewItem;

	constructor() {}

	addTreeViewItem(
		childTreeViewItem: TreeViewItem,
		parentTreeViewItem?: TreeViewItem
	) {
		if (!parentTreeViewItem) {
			this.rootTreeViewItem = childTreeViewItem;
			this.currentTreeViewItem = this.rootTreeViewItem;
		} else {
			parentTreeViewItem.children.push(childTreeViewItem);
			this.currentTreeViewItem = childTreeViewItem;
		}
	}
}

export function createInitialTreeViewState(
	lView: LView,
	isRoot: boolean,
	parent?: TreeViewItem
): TreeViewItem {
	return {
		lView,
		currentIndex: 0,
		children: [],
		isRoot,
		parent
	};
}

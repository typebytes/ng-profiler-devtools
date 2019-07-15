import { FLAGS, HOST, LView, LViewFlags } from './types/angular_core';
import { DEVTOOLS_IDENTIFIER } from './constants';

export interface SerializedTreeViewItem {
	uuid: string;
	children: SerializedTreeViewItem[];
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

export function serialiseTreeViewItem(
	treeViewItem: TreeViewItem
): SerializedTreeViewItem {
	return {
		uuid: treeViewItem.lView[HOST][DEVTOOLS_IDENTIFIER],
		children: treeViewItem.children.map(loopTreeViewItem =>
			serialiseTreeViewItem(loopTreeViewItem)
		),
		tagName: treeViewItem.lView[0].tagName,
		onPush: (treeViewItem.lView[FLAGS] & LViewFlags.CheckAlways) === 0
	};
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

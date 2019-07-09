import { FLAGS, HOST, LView, LViewFlags } from './types/angular_core';
import { DEVTOOLS_IDENTIFIER } from './constants';

export interface SerializedTreeViewItem {
	// TODO: should become a serializable identifier later
	uuid: string;
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

export function serialiseTreeViewItem(
	treeViewItem: TreeViewItem
): SerializedTreeViewItem {
	console.log(treeViewItem.lView[FLAGS] & 0b00000010000);
	return {
		uuid: treeViewItem.lView[HOST][DEVTOOLS_IDENTIFIER],
		children: treeViewItem.children.map(loopTreeViewItem =>
			serialiseTreeViewItem(loopTreeViewItem)
		),
		tagName: treeViewItem.lView[0].tagName,
		onPush: (treeViewItem.lView[FLAGS] & LViewFlags.CheckAlways) === 0,
		checked: false
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

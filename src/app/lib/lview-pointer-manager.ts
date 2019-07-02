import { LView } from './types/angular_core';

export interface TreeViewItem {
	lView: LView;
	currentIndex: number;
	children: TreeViewItem[];
	currentDynamicIndex?: number;
	parent?: TreeViewItem;
	isRoot: boolean;
	nextCurrent?: any;
	checkedDynamicComponents?: boolean;
}

export class LViewPointerManager {
	stateLView: LView;
	isFirstExecution = false;
	rootTree: TreeViewItem;
	currentTree: TreeViewItem;
}

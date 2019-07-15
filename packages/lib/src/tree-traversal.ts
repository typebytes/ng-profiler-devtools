import {
	ACTIVE_INDEX,
	CHILD_HEAD,
	HEADER_OFFSET,
	HOST,
	LContainer,
	LView,
	NEXT,
	TVIEW,
	VIEW_REFS
} from './types/angular_core';
import { getComponentViewByIndex } from './util';
import {
	createInitialTreeViewState,
	SerializedTreeViewItem,
	TreeViewItem
} from './tree-view-builder';
import * as uuid from 'uuid';
import { DEVTOOLS_IDENTIFIER } from './constants';

export function loopDynamicEmbeddedViews({
	lView,
	work,
	nextCurrentLContainer,
	nextViewRefIndex,
	exitLoopPrematurely = false
}: {
	lView: LView;
	work: (
		nextLView: LView,
		lastViewRef: boolean,
		currentViewRefIndex: number,
		nextLContainer: LContainer
	) => void;
	nextCurrentLContainer?: LContainer;
	nextViewRefIndex?: number;
	exitLoopPrematurely?: boolean;
}) {
	for (
		let current: LContainer =
			nextCurrentLContainer !== undefined
				? nextCurrentLContainer
				: lView[CHILD_HEAD];
		current !== null;
		current = current[NEXT]
	) {
		if (current.length < HEADER_OFFSET && current[ACTIVE_INDEX] === -1) {
			for (
				let i = nextViewRefIndex ? nextViewRefIndex : 0;
				i < current[VIEW_REFS].length;
				i++
			) {
				const dynamicViewData = current[VIEW_REFS][i];
				work(
					dynamicViewData,
					i === current[VIEW_REFS].length - 1,
					i,
					current[NEXT]
				);
				if (exitLoopPrematurely) {
					return true;
				}
			}
		}
	}
	return false;
}

export function loopChildComponents({
	lView,
	work,
	exitLoopPrematurely
}: {
	lView: LView;
	work: (lView: LView) => void;
	exitLoopPrematurely?: boolean;
}) {
	const tView = lView[TVIEW];
	if (tView.components != null) {
		for (let i = 0; i < tView.components.length; i++) {
			const childLView = getComponentViewByIndex(tView.components[i], lView);
			work(childLView);
			if (exitLoopPrematurely) {
				return true;
			}
		}
	}
	return false;
}

export function traverseTreeAndCreateTreeStructure(
	rootLView: LView,
	isRoot: boolean
) {
	const addElement = (
		treeViewItem: TreeViewItem,
		parentTreeViewItem: TreeViewItem
	) => parentTreeViewItem.children.push(treeViewItem);
	return traverseTreeToStructure(addElement)(rootLView, isRoot);
}

export function traverseTreeAndCreateInstructions(
	rootLView: LView,
	isRoot: boolean
) {
	const instructions = [];
	const addElement = (treeViewItem: TreeViewItem) =>
		instructions.push(treeViewItem);
	return traverseTreeToStructure(addElement, instructions)(rootLView, isRoot);
}

const traverseTreeToStructure = (
	addElement: (
		treeViewItem: TreeViewItem,
		parentTreeViewItem: TreeViewItem
	) => void,
	accumulator?: any
) => {
	return function traverseTree(
		lView: LView,
		isRoot: boolean,
		parentTreeViewItem?: TreeViewItem
	) {
		const treeViewItem = createInitialTreeViewState(
			lView,
			isRoot,
			parentTreeViewItem
		);

		// Only when the lView has a host element do we want to add it, otherwise it's a dynamicEmbeddedView
		if (lView[HOST] && !isRoot) {
			// If there is a parentTreeViewItem, it means that the currentTreeViewItem was a dynamic one, so we add it to the parent
			addElement(treeViewItem, parentTreeViewItem);
		}

		const whenDynamicEmbeddedViewFound = (dynamicLView: LView) => {
			traverseTree(
				dynamicLView,
				false,
				treeViewItem.lView[HOST] ? treeViewItem : parentTreeViewItem
			);
		};

		loopDynamicEmbeddedViews({
			lView,
			work: whenDynamicEmbeddedViewFound
		});

		const whenChildComponentFound = (childLView: LView) => {
			if (!childLView[HOST][DEVTOOLS_IDENTIFIER]) {
				childLView[HOST][DEVTOOLS_IDENTIFIER] = uuid();
			}
			traverseTree(
				childLView,
				false,
				treeViewItem.lView[HOST] ? treeViewItem : parentTreeViewItem
			);
		};

		loopChildComponents({ lView, work: whenChildComponentFound });

		if (isRoot) {
			return accumulator ? accumulator : treeViewItem;
		}
	};
};

export function transformTreeToInstructions(
	inputTreeViewItem: SerializedTreeViewItem
) {
	const instructions = new Map<string, SerializedTreeViewItem>();

	const walkTree = (treeViewItem: SerializedTreeViewItem) => {
		instructions.set(treeViewItem.uuid, treeViewItem);
		treeViewItem.children.forEach(childTreeViewItem =>
			walkTree(childTreeViewItem)
		);
	};

	walkTree(inputTreeViewItem);

	return instructions;
}

// Because of dynamicEmbeddedViews and because we need to be able to walk the tree, some elements are added as parents which aren't
// components, we need to filter those out
export function getRealParent(treeViewItem: TreeViewItem) {
	if (treeViewItem.lView[HOST]) {
		return treeViewItem;
	} else {
		return getRealParent(treeViewItem.parent);
	}
}

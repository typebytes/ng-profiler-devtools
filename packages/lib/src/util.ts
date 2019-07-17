import {
	FLAGS,
	HOST,
	LContainer,
	LContext,
	LView,
	LViewFlags,
	MONKEY_PATCH_KEY_NAME,
	TYPE
} from './types/angular_core';

export function monkeyPatchFunction(obj, property, monkeyPatchFn) {
	obj[property] = monkeyPatchFn;
}

export function getComponentViewByIndex(
	nodeIndex: number,
	hostView: LView
): LView {
	// Could be an LView or an LContainer. If LContainer, unwrap to find LView.
	const slotValue = hostView[nodeIndex];
	const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
	return lView;
}

export function isLView(
	value: any | LView | LContainer | any | {} | null
): value is LView {
	return Array.isArray(value) && typeof value[TYPE] === 'object';
}

export function isLContainer(value: LContainer | {} | null): value is LContainer {
	return Array.isArray(value) && value[TYPE] === true;
}

export function readPatchedData(target: any): LView | LContext | null {
	return target[MONKEY_PATCH_KEY_NAME];
}

export function readPatchedLView(target: any): LView | null {
	const value = readPatchedData(target);
	if (value) {
		return Array.isArray(value) ? value : (value as LContext).lView;
	}
	return null;
}

export function isCreationMode(view: LView): boolean {
	return (view[FLAGS] & LViewFlags.CreationMode) === LViewFlags.CreationMode;
}

function viewAttachedToChangeDetector(view): boolean {
	return (view[FLAGS] & LViewFlags.Attached) === LViewFlags.Attached;
}

export function shouldLViewBeChecked(lView: LView): boolean {
	return (
		(viewAttachedToChangeDetector(lView) || isCreationMode(lView)) &&
		(lView[FLAGS] & (LViewFlags.CheckAlways | LViewFlags.Dirty)) === 0
	);
}

export function findAngularRootNode(node): LView {
	if (!node || !node.childNodes) {
		return;
	}
	const childNodes = node.childNodes;
	for (let i = 0; i < childNodes.length; i++) {
		const childNode = childNodes[i];
		if (childNode[MONKEY_PATCH_KEY_NAME]) {
			return childNode[MONKEY_PATCH_KEY_NAME];
		} else {
			const potentialRootNode = findAngularRootNode(childNode);
			if (potentialRootNode) {
				return potentialRootNode;
			}
		}
	}
}

export function mapToObject(map: Map<any, any>) {
	const obj = {};
	for (let [key, value] of map) {
		obj[key] = value;
	}
	return obj;
}

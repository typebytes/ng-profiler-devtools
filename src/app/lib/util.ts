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

/**
 * Will read the __ngContext__ property from a target
 *
 * @param target
 */
export function readPatchedData(target: any): LView | LContext | null {
	return target[MONKEY_PATCH_KEY_NAME];
}

/**
 * Gets the LView from a target
 *
 * @param target
 */
export function readPatchedLView(target: any): LView | null {
	const value = readPatchedData(target);
	if (value) {
		return Array.isArray(value) ? value : (value as LContext).lView;
	}
	return null;
}

/**
 * Checks if a view is in creation mode
 *
 * @param view
 */
export function isCreationMode(view: LView): boolean {
	return (view[FLAGS] & LViewFlags.CreationMode) === LViewFlags.CreationMode;
}

function viewAttachedToChangeDetector(view): boolean {
	return (view[FLAGS] & 128) /* Attached */ === 128 /* Attached */;
}

export function shouldLViewBeChecked(lView: LView): boolean {
	return (
		(viewAttachedToChangeDetector(lView) || isCreationMode(lView)) &&
		(lView[FLAGS] & (LViewFlags.CheckAlways | LViewFlags.Dirty)) === 0
	);
}

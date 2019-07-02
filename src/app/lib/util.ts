import { HOST, LContainer, LView, TYPE } from './types/angular_core';

export function monkeyPatchFunction(obj, property, monkeyPatchFn) {
	obj[property] = monkeyPatchFn;
}

export function getComponentViewByIndex(nodeIndex: number, hostView: LView): LView {
	// Could be an LView or an LContainer. If LContainer, unwrap to find LView.
	const slotValue = hostView[nodeIndex];
	const lView = isLView(slotValue) ? slotValue : slotValue[HOST];
	return lView;
}

export function isLView(value: any | LView | LContainer | any | {} | null):
	value is LView {
	return Array.isArray(value) && typeof value[TYPE] === 'object';
}

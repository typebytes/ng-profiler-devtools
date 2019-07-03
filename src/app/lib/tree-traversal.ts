import { LContainer, LView, TVIEW } from './types/angular_core';
import {
	ACTIVE_INDEX,
	CHILD_HEAD,
	HEADER_OFFSET,
	NEXT,
	VIEW_REFS
} from '../../assets/types/angular_core';
import { getComponentViewByIndex } from './util';

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
	exitLoopPrematurely: boolean;
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

import { HOST, LView, RootContext, TView, TVIEW } from './types/angular_core';
import { createMeasurement, Tracer } from './tracing';
import { LViewStateManager } from './l-view-state-manager';
import { DEVTOOLS_IDENTIFIER, readPatchedLView } from './util';
import {
	loopChildComponents,
	loopDynamicEmbeddedViews,
	traverseTree
} from './tree-traversal';
import { scheduleOutsideOfZone } from './zone-handler';
import { renderTree } from './visualisation/graph';
import * as uuid from 'uuid';
import { serialiseTreeViewItem } from './tree-view-builder';

const tracer = new Tracer();
const lViewStateManager = new LViewStateManager();

const monkeyPatchTemplate = (tView: TView, rootLView?: LView) => {
	if ((tView.template as any).__template_patched__) {
		return;
	}
	const origTemplate = tView.template;
	tView.template = function(...args) {
		// Mode will be 1 for creation and 2 for update
		const mode = args[0];
		// Don't get the next lView if we are in creation mode as it will be called immediately in update mode
		if (mode === 1) {
			origTemplate(...args);
			return;
		}
		if (rootLView) {
			// If we have the rootLView, it means that we have started a new cycle
			lViewStateManager.resetState();
			scheduleOutsideOfZone(() => {
				const updatedTree = lViewStateManager.getTree();
				console.log(serialiseTreeViewItem(updatedTree));
				renderTree('updatedTree', lViewStateManager.getTree());
				const tree = traverseTree(rootLView, true);
				console.log(serialiseTreeViewItem(tree));
				renderTree('tree', traverseTree(rootLView, true));
			});
		}
		// Set the pointer to the next lView
		lViewStateManager.getNextLView(null, rootLView);
		const currentLView = lViewStateManager.predictedNextLView;
		origTemplate(...args);

		// After executing the template, we need to check if components were added
		// TODO: check if we need to check child components again (prolly dynamicEmbeddedViews are enough)
		monkeyPatchDirectChildren(currentLView);

		// Lastly, we need to update the Tracer to show a box. This has to be done in a timeout as the view dimensions have not
		// been updated at this point yet.
		scheduleOutsideOfZone(() =>
			tracer.present(
				currentLView,
				currentLView[HOST].tagName,
				createMeasurement(currentLView[0].getBoundingClientRect())
			)
		);
	};
	(tView.template as any).__template_patched__ = true;
};

export function monkeyPatchDirectChildren(lView: LView, isRoot = false) {
	// Patch direct child components
	let whenChildComponentFound;
	if (isRoot) {
		whenChildComponentFound = (childLView: LView) =>
			monkeyPatchTemplate(childLView[TVIEW], childLView);
	} else {
		whenChildComponentFound = (childLView: LView) =>
			monkeyPatchTemplate(childLView[TVIEW]);
	}
	loopChildComponents({ lView, work: whenChildComponentFound });
	// Find components in the dynamicEmbeddedViews to patch
	const whenDynamicEmbeddedViewFound = (dynamicLView: LView) => {
		if (dynamicLView[HOST]) {
			monkeyPatchTemplate(dynamicLView[TVIEW]);
		}
		monkeyPatchDirectChildren(dynamicLView);
	};
	loopDynamicEmbeddedViews({ lView, work: whenDynamicEmbeddedViewFound });
}

export function monkeyPatchRootNode(rootContext: RootContext) {
	for (let i = 0; i < rootContext.components.length; i++) {
		const rootComponent = rootContext.components[i];
		const rootComponentLView = readPatchedLView(rootComponent);
		monkeyPatchDirectChildren(rootComponentLView, true);
	}
}

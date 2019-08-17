import { HOST, LView, RootContext, TView, TVIEW } from './types/angular_core';
import { createMeasurement, Tracer } from './visualisation/tracing';
import { LViewStateManager } from './l-view-state-manager';
import { mapToObject, readPatchedLView } from './util';
import {
	loopChildComponents,
	loopDynamicEmbeddedViews,
	transformTreeToInstructions,
	traverseTreeAndCreateTreeStructure
} from './tree-traversal';
import { scheduleOutsideOfZone } from './zone-handler';
import { GraphRender } from './visualisation/graph';
import * as uuid from 'uuid';
import { DEVTOOLS_IDENTIFIER } from './constants';
import { serialiseTreeViewItem } from './tree-view-builder';

const tracer = new Tracer();
const treeGraph = new GraphRender('liveTree');
const lViewStateManager = new LViewStateManager();

let patchedTemplateFns: Array<{ tView: TView, origTemplate: Function }> = [];

// In dev mode, there will be two cycles. The second cycle is purely used for making sure the unidirectional data flow is followed and
// should not be visualised. We opt to not track this second cycle.
let cdCycleCountInCurrentLoop = 0;
const monkeyPatchTemplate = (tView: TView, rootLView?: LView) => {
	if ((tView.template as any).__template_patched__) {
		return;
	}
	const origTemplate = tView.template;
	tView.template = function (...args) {
		if (rootLView) {
			cdCycleCountInCurrentLoop++;
		}
		// Mode will be 1 for creation and 2 for update
		const mode = args[0];
		// Don't get the next lView if we are in creation mode as it will be called immediately in update mode
		if (mode === 1 || cdCycleCountInCurrentLoop !== 1) {
			origTemplate(...args);
			return;
		}
		if (rootLView) {
			// If we have the rootLView, it means that we have started a new cycle
			lViewStateManager.resetState();
			scheduleOutsideOfZone(() => {
				cdCycleCountInCurrentLoop = 0;
				const updatedTree = serialiseTreeViewItem(lViewStateManager.getTree());
				const entireTree = serialiseTreeViewItem(
					traverseTreeAndCreateTreeStructure(rootLView, true)
				);
				const updatedTreeAsInstructions = transformTreeToInstructions(
					updatedTree
				);
				// treeGraph.setUpdates(entireTree, updatedTreeAsInstructions);
				// renderTree('lastUpdatedTree', entireTree, updatedTreeAsInstructions);
				// const events = new CustomEvent('PassToBackground', {detail: message});

				// sendMessage({
				// 	type: 'ENTIRE_TREE',
				// 	payload: {entireTree, instructions: mapToObject(updatedTreeAsInstructions)}
				// });
				// sendMessage({
				// 	type: 'UPDATED_TREE',
				// 	payload: {updatedTree}
				// });
				// window.postMessage('whatever', '*');
				window.dispatchEvent(new CustomEvent('ContentScriptEvent', {
					detail: {
						type: 'ENTIRE_TREE',
						payload: {entireTree, instructions: mapToObject(updatedTreeAsInstructions)}
					}
				}));
				window.dispatchEvent(new CustomEvent('ContentScriptEvent', {
					detail: {
						type: 'UPDATED_TREE',
						payload: {updatedTree}
					}
				}));
			});
		}
		// Set the pointer to the next lView
		lViewStateManager.getNextLView(null, rootLView);
		const currentLView = lViewStateManager.predictedNextLView;
		// console.log('CD for ', currentLView[HOST].tagName);

		if (!currentLView[HOST][DEVTOOLS_IDENTIFIER]) {
			currentLView[HOST][DEVTOOLS_IDENTIFIER] = uuid();
		}
		origTemplate(...args);

		// After executing the template, we need to check if components were added
		// TODO: check if we need to check child components again (prolly dynamicEmbeddedViews are enough)
		monkeyPatchDirectChildren(currentLView);

		// Lastly, we need to update the Tracer to show a box. This has to be done in a timeout as the view dimensions have not
		// been updated at this point yet.
		scheduleOutsideOfZone(() => {
				// console.log(`Tracing for ${currentLView[HOST].tagName}`, currentLView[HOST]);
				tracer.present(
					currentLView[HOST][DEVTOOLS_IDENTIFIER],
					currentLView[HOST].tagName,
					createMeasurement(currentLView[0].getBoundingClientRect())
				);
			}
		);
	};
	(tView.template as any).__template_patched__ = true;

	patchedTemplateFns.push({origTemplate: origTemplate, tView});
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
	loopChildComponents({lView, work: whenChildComponentFound});
	// Find components in the dynamicEmbeddedViews to patch
	const whenDynamicEmbeddedViewFound = (dynamicLView: LView) => {
		if (dynamicLView[HOST]) {
			monkeyPatchTemplate(dynamicLView[TVIEW]);
		}
		monkeyPatchDirectChildren(dynamicLView);
	};
	loopDynamicEmbeddedViews({lView, work: whenDynamicEmbeddedViewFound});
}

export function monkeyPatchRootNode(rootContext: RootContext) {
	for (let i = 0; i < rootContext.components.length; i++) {
		const rootComponent = rootContext.components[i];
		const rootComponentLView = readPatchedLView(rootComponent);
		monkeyPatchDirectChildren(rootComponentLView, true);
	}
}

export function undoMonkeyPatch() {
	patchedTemplateFns.forEach(data => {
		data.tView.template = data.origTemplate;
	});
	patchedTemplateFns = [];
}

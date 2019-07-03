import {
	CONTEXT,
	HOST,
	LView,
	MONKEY_PATCH_KEY_NAME,
	RootContext,
	TView,
	TVIEW
} from './lib/types/angular_core';
import { createMeasurement, Tracer } from './lib/tracing';
import { LViewStateManager } from './lib/l-view-state-manager';
import { getComponentViewByIndex, readPatchedLView } from './lib/util';
import {
	loopChildComponents,
	loopDynamicEmbeddedViews
} from './lib/tree-traversal';

declare const Zone;

const tracer = new Tracer();
const lViewPointerManager = new LViewStateManager();

let isFirstExecution = true;
let rootNode;
// Best inside the closure
const monkeyPatchTemplate = (tView: TView) => {
	let rootLView;
	if (isFirstExecution) {
		isFirstExecution = false;
		// TODO clean up and make sure it works for multiple root nodes
		rootLView = readPatchedLView(
			(rootNode[CONTEXT] as RootContext).components[0]
		)[20];
	}
	if ((tView.template as any).__patched) {
		return;
	}
	const origTemplate = tView.template;
	tView.template = function(...args) {
		rootLView && lViewPointerManager.resetState();
		if (rootLView) {
			Zone.root.run(() =>
				setTimeout(resolve => {
					console.log(
						"Let's loop everything and match it with the updated tree"
					);
				})
			);
		}
		// If not creation mode, the element doesn't exist yet so no lView to fetch yet!!! Will be fetched only during update mode
		if (args[0] === 2) {
			lViewPointerManager.getNextLView(null, rootLView);
		}
		const currentLView = rootLView
			? rootLView
			: lViewPointerManager.predictedNextLView;
		const tagName = currentLView[HOST].tagName;
		console.log(
			'CD for ',
			args[0] === 2 ? tagName : 'check the next statement :)',
			args[0]
		);
		// console.debug(currentLView);
		origTemplate(...args);
		// time to walk the tree from this instance to see if new dynamic
		// views were created
		// console.debug(currentLView);
		// console.log('patching the other views');
		monkeyPatchDescendantViews(currentLView, true);

		// console.debug('Predict the next lView after ', tagName);
		if (args[0] === 2) {
			Zone.root.run(() => {
				// console.debug('updated', currentLView);
				setTimeout(() =>
					tracer.present(
						currentLView,
						tagName,
						createMeasurement(currentLView[0].getBoundingClientRect())
					)
				);
			});
		}
	};
	(tView.template as any).__patched = true;
};

const findRootNode = node => {
	if (!node || !node.childNodes) {
		return;
	}
	const childNodes = node.childNodes;
	for (let i = 0; i < childNodes.length; i++) {
		const childNode = childNodes[i];
		if (childNode[MONKEY_PATCH_KEY_NAME]) {
			rootNode = childNode[MONKEY_PATCH_KEY_NAME].debug._raw_lView;
			monkeyPatchRootTree(rootNode[CONTEXT] as RootContext);
		} else {
			findRootNode(childNode);
		}
	}
};

export function start() {
	setTimeout(() => {
		findRootNode(document.body);
	}, 200);
}

function refreshDynamicEmbeddedViews(lView: LView) {
	const work = (dynamicLView: LView) =>
		monkeyPatchDescendantViews(dynamicLView);
	loopDynamicEmbeddedViews({ lView, work });
}

export function monkeyPatchDescendantViews(
	lView: LView,
	firstLevelOnly = false
) {
	// const tView: TView = lView[TVIEW];

	// monkeyPatchChildComponents(tView.components, lView, firstLevelOnly);
	const work = (childLView: LView) => monkeyPatchTemplate(childLView[TVIEW]);
	loopChildComponents({ lView, work, exitLoopPrematurely: true });
	refreshDynamicEmbeddedViews(lView);
}

/**
 * Will loop over the root components and monkey patch all the template functions
 *
 * @param rootContext
 */
export function monkeyPatchRootTree(rootContext: RootContext) {
	for (let i = 0; i < rootContext.components.length; i++) {
		const rootComponent = rootContext.components[i];
		monkeyPatchDescendantViews(readPatchedLView(rootComponent), true);
	}
}

export function loopAll(updatedTree) {}

// const origSetTimeout = window.setTimeout;
// window.setTimeout = function(...args) {
//
// };
import {
	CONTEXT,
	FLAGS,
	HOST,
	LContainer,
	LContext,
	LView,
	LViewFlags,
	MONKEY_PATCH_KEY_NAME,
	RootContext,
	TView,
	TVIEW,
	TYPE
} from './types/angular_core';
import { ACTIVE_INDEX, CHILD_HEAD, HEADER_OFFSET, NEXT, VIEW_REFS } from '../assets/types/angular_core';
import { createMeasurement, Tracer } from './tracing';

declare const Zone;


const tracer = new Tracer();

/**
 * This is the next lView that will be used by a certain template function
 */
let stateLView: LView;

let isFirstExecution = false;
const monkeyPatchTemplate = (tView: TView) => {
	let rootLView;
	if (!isFirstExecution) {
		isFirstExecution = true;
		// FIXME CLEAN THIS UP!!!
		rootLView = readPatchedLView((stateLView[CONTEXT] as RootContext).components[0])[20];
		console.debug(rootLView);
	}
	if ((tView.template as any).__patched) {
		console.debug('already patched');
		return;
	}
	const origTemplate = tView.template;
	console.debug('patching', tView.template);
	tView.template = function (...args) {
		// gets the next lView to be checked
		rootLView && resetState();
		// If not creation mode, the element doesn't exist yet so no lView to fetch yet!!! Will be fetched only during update mode
		if (args[0] === 2) {
			getNextLView(currentTree, rootLView);
		}
		const currentLView = rootLView ? rootLView : stateLView;
		const tagName = currentLView[HOST].tagName;
		console.log('CD for ', tagName, args[0]);
		console.debug(currentLView);
		origTemplate(...args);
		// time to walk the tree from this instance to see if new dynamic
		// views were created
		console.log(currentLView);
		monkeyPatchDescendantViews(currentLView, true);

		console.debug('Predict the next lView after ', tagName);
		Zone.root.run(() => {
			console.log('updated', currentLView);
			setTimeout(() => tracer.present(currentLView, tagName, createMeasurement(currentLView[0].getBoundingClientRect())));
		});
	};
	(tView.template as any).__patched = true;
};

const findRootNode = (node) => {
	if (!node || !node.childNodes) {
		return;
	}
	const childNodes = node.childNodes;
	for (let i = 0; i < childNodes.length; i++) {
		const childNode = childNodes[i];
		if (childNode[MONKEY_PATCH_KEY_NAME]) {
			// const instance = childNode.__ngContext__.debug._raw_lView[20];
			// monkeyPatchTemplate(instance, true);
			// loopComponents(instance);
			const rootLView: LView = childNode[MONKEY_PATCH_KEY_NAME].debug._raw_lView;
			stateLView = rootLView;
			monkeyPatchRootTree(rootLView[CONTEXT] as RootContext);
		} else {
			findRootNode(childNode);
		}
	}
};


export function start() {
	setTimeout(() => {
		console.debug('booting the plugin');

		findRootNode(document.body);
	}, 2000);
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

/**
 * Gets the child lView from the parent, monkey patches the template function and does the same for its children
 *
 * @param adjustedElementIndex
 * @param lView
 */
function componentRefresh(adjustedElementIndex: number, lView: LView) {
	const childLView = getComponentViewByIndex(adjustedElementIndex, lView);
	monkeyPatchTemplate(childLView[TVIEW]);
	monkeyPatchDescendantViews(childLView);
}

/** Refreshes child components in the current view. */
function monkeyPatchChildComponents(components: number[] | null, lView: LView): void {
	if (components != null) {
		for (let i = 0; i < components.length; i++) {
			componentRefresh(components[i], lView);
		}
	}
}

// TODO: properly name this
interface ViewLoop {
	lView: LView;
	currentIndex: number;
	children: ViewLoop[];
	currentDynamicIndex?: number;
	parent?: ViewLoop;
	isRoot: boolean;
	nextCurrent?: any;
	checkedDynamicComponents?: boolean;
}

let rootTree: ViewLoop;
let currentTree: ViewLoop;

function resetState() {
	rootTree = null;
	currentTree = null;
	stateLView = null;
}

/**
 * In case the first argument is empty, we need to recreate the rootTree so we can use the second argument for this
 * @param viewLoop
 * @param rootLView
 */
function getNextLView(viewLoop?: ViewLoop, rootLView?: LView) {
	if (!rootTree) {
		rootTree = {
			lView: rootLView,
			currentIndex: 0,
			children: [],
			isRoot: true
		};
		currentTree = rootTree;
		viewLoop = rootTree;
		return;
	}
	if (!viewLoop.checkedDynamicComponents) {
		// first check dynamic embedded views
		for (let current: LContainer = viewLoop.nextCurrent !== undefined ? viewLoop.nextCurrent : viewLoop.lView[CHILD_HEAD]; current !== null; current = current[NEXT]) {
			// Note: current can be an LView or an LContainer instance, but here we are only interested
			// in LContainer. We can tell it's an LContainer because its length is less than the LView
			// header.
			if (current.length < HEADER_OFFSET && current[ACTIVE_INDEX] === -1) {
				/** @type {?} */
				const container = (/** @type {?} */ (current));
				for (let i = viewLoop.currentDynamicIndex ? viewLoop.currentDynamicIndex : 0; i < container[VIEW_REFS].length; i++) {
					/** @type {?} */
					const dynamicViewData = container[VIEW_REFS][i];
					// if we've looped every element in this list, it doesn't make sense to loop it again, with the next iteration,
					// we want to start from the next 'current'
					if (i === container[VIEW_REFS].length - 1) {
						viewLoop.nextCurrent = current[NEXT];
					} else {
						// In the other case, we need to keep a reference the index that we are currently at
						viewLoop.currentDynamicIndex = i + 1;
					}
					getNextLView({
						lView: dynamicViewData,
						currentIndex: 0,
						children: [],
						parent: viewLoop,
						isRoot: false
					});
					return;
				}
			}
		}
		viewLoop.checkedDynamicComponents = true;
	}

	// check child components
	const components = viewLoop.lView[TVIEW].components;

	if (!components) {
		getNextLView(viewLoop.parent);
		return;
	}
	if (viewLoop.currentIndex >= components.length) {
		// Done with looping the components, need to go one up and set prev lView
		if (!viewLoop.isRoot) {
			getNextLView(viewLoop.parent);
			return;
		} else {
			console.log('done', viewLoop);
		}
		return;
	}
	// Check if the potential lView is
	// - attached
	// - detached and dirty
	const potentialLView = viewLoop.lView[components[viewLoop.currentIndex]];
	console.log('ref -> ', potentialLView);
	if (!viewLoop.isRoot && !((viewAttachedToChangeDetector(potentialLView) || isCreationMode(potentialLView)) &&
		potentialLView[FLAGS] & (16 /* CheckAlways */ | 64 /* Dirty */))) {
		console.log('CHECKED -> ', potentialLView);
		viewLoop.currentIndex++;
		getNextLView(viewLoop);
		return;
	}
	stateLView = viewLoop.lView[components[viewLoop.currentIndex]] || viewLoop.lView;
	console.log('Prediction is', stateLView[HOST]);
	viewLoop.currentIndex++;
	const newCurrentTree = {
		lView: stateLView,
		currentIndex: 0,
		children: [],
		parent: viewLoop,
		isRoot: false
	};
	addChildToParent(viewLoop, newCurrentTree);
	currentTree = newCurrentTree;
}

function addChildToParent(viewLoop: ViewLoop, treeToAdd: ViewLoop) {
	if (viewLoop.lView[HOST]) {
		viewLoop.children.push(treeToAdd);
	} else {
		addChildToParent(viewLoop.parent, treeToAdd);
	}
}

function viewAttachedToChangeDetector(view) {
	return (view[FLAGS] & 128 /* Attached */) === 128 /* Attached */;
}

function refreshDynamicEmbeddedViews(lView) {
	for (let current: LContainer = lView[CHILD_HEAD]; current !== null; current = current[NEXT]) {
		// Note: current can be an LView or an LContainer instance, but here we are only interested
		// in LContainer. We can tell it's an LContainer because its length is less than the LView
		// header.
		if (current.length < HEADER_OFFSET && current[ACTIVE_INDEX] === -1) {
			/** @type {?} */
			const container = (/** @type {?} */ (current));
			for (let i = 0; i < container[VIEW_REFS].length; i++) {
				/** @type {?} */
				const dynamicViewData = container[VIEW_REFS][i];
				// Should be the ngFor context
				// console.debug(dynamicViewData);
				monkeyPatchDescendantViews(dynamicViewData);
				// renderEmbeddedTemplate(dynamicViewData, dynamicViewData[TVIEW], (/** @type {?} */ (dynamicViewData[CONTEXT])));
			}
		}
	}
}


export function monkeyPatchDescendantViews(lView: LView, onlyDynamic = false) {
	const tView: TView = lView[TVIEW];

	const creationMode = isCreationMode(lView);

	if (!onlyDynamic) {
		monkeyPatchChildComponents(tView.components, lView);
	}
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
		monkeyPatchDescendantViews(readPatchedLView(rootComponent));
	}
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


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

declare const Zone;

const CANVAS_NODE_ID = 'TraceUpdatesWebNodePresenter';

const OUTLINE_COLOR = '#f0f0f0';

const COLORS = [
	// coolest
	'#55cef6',
	'#55f67b',
	'#a5f655',
	'#f4f655',
	'#f6a555',
	'#f66855',
	// hottest
	'#ff0000',
];

const HOTTEST_COLOR = COLORS[COLORS.length - 1];
const DURATION = 250;

class Tracer {
	_canvas;
	_pool = new Map();
	_drawing;
	_clearTimer;

	present(tagName, measurement) {
		var data;
		if (this._pool.has(tagName)) {
			console.log('old measurement');
			data = this._pool.get(tagName);
		} else {
			console.log('new measurement');
			data = {
				hit: 0,
				...measurement
			};
		}

		data = {
			...data,
			expiration: Date.now() + DURATION,
			hit: data.hit + 1,
		};

		this._pool = this._pool.set(tagName, data);

		if (this._drawing) {
			return;
		}

		this._drawing = true;
		Zone.root.run(() => {
			requestAnimationFrame(this._draw.bind(this));
		});
	}

	_draw() {
		var now = Date.now();
		var minExpiration = Number.MAX_VALUE;

		const temp = new Map();
		for (let [tagName, data] of this._pool.entries()) {
			if (data.expiration < now) {
				// already passed the expiration time.
			} else {
				// TODO what does this even do?
				// console.log('setting', minExpiration);
				minExpiration = Math.min(data.expiration, minExpiration);
				// console.log('setting', minExpiration);
				temp.set(tagName, data);
			}
		}
		this._pool = temp;

		this.drawImpl(this._pool);

		if (this._pool.size > 0) {
			// debugger;
			if (this._clearTimer != null) {
				clearTimeout(this._clearTimer);
			}
			this._clearTimer = Zone.root.run(() => {
				setTimeout(this._redraw.bind(this), minExpiration - now);
			});
		}

		this._drawing = false;
	}

	_redraw() {
		this._clearTimer = null;
		if (!this._drawing && this._pool.size > 0) {
			this._drawing = true;
			this._draw();
		}
	}

	drawImpl(pool) {
		this._ensureCanvas();
		var canvas = this._canvas;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(
			0,
			0,
			canvas.width,
			canvas.height
		);
		console.log(pool);
		for (const [tagName, data] of pool.entries()) {
			console.log(data.hit);

			const color = COLORS[data.hit - 1] || HOTTEST_COLOR;
			drawBorder(ctx, data, 1, color);
		}
	}


	clearImpl() {
		var canvas = this._canvas;
		if (canvas === null) {
			return;
		}

		if (!canvas.parentNode) {
			return;
		}

		var ctx = canvas.getContext('2d');
		ctx.clearRect(
			0,
			0,
			canvas.width,
			canvas.height
		);

		canvas.parentNode.removeChild(canvas);
		this._canvas = null;
	}

	_ensureCanvas() {
		var canvas = this._canvas;
		if (canvas === null || canvas === undefined) {
			canvas =
				window.document.getElementById(CANVAS_NODE_ID) ||
				window.document.createElement('canvas');

			canvas.id = CANVAS_NODE_ID;
			canvas.width = window.screen.availWidth;
			canvas.height = window.screen.availHeight;
			canvas.style.cssText = `
        xx-background-color: red;
        xx-opacity: 0.5;
        bottom: 0;
        left: 0;
        pointer-events: none;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 1000000000;
      `;
		}

		if (!canvas.parentNode) {
			var root = window.document.documentElement;
			root.insertBefore(canvas, root.firstChild);
		}
		this._canvas = canvas;
	}
}


function drawBorder(ctx, measurement, borderWidth, borderColor) {
	// outline
	ctx.lineWidth = 1;
	ctx.strokeStyle = OUTLINE_COLOR;

	ctx.strokeRect(
		measurement.left - 1,
		measurement.top - 1,
		measurement.width + 2,
		measurement.height + 2,
	);

	// inset
	ctx.lineWidth = 1;
	ctx.strokeStyle = OUTLINE_COLOR;
	ctx.strokeRect(
		measurement.left + borderWidth,
		measurement.top + borderWidth,
		measurement.width - borderWidth,
		measurement.height - borderWidth,
	);
	ctx.strokeStyle = borderColor;


	// if (measurement.should_update) {
	ctx.setLineDash([0]);
	// } else {
	//     ctx.setLineDash([0]);
	// }

	// border
	ctx.lineWidth = '' + borderWidth;
	ctx.strokeRect(
		measurement.left + Math.floor(borderWidth / 2),
		measurement.top + Math.floor(borderWidth / 2),
		measurement.width - borderWidth,
		measurement.height - borderWidth,
	);

	ctx.setLineDash([0]);
}

let borderRemovals = [];


// export type Measurement = {
//     bottom: number,
//     expiration: number,
//     height: number,
//     id: string,
//     left: number,
//     right: number,
//     scrollX: number,
//     scrollY: number,
//     top: number,
//     width: number,
// };

const createMeasurement = (rect) => {
	return {
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height,
	};
};

const createDiv = (rect, spanText) => {
	const div = document.createElement('div');
	div.style.position = 'fixed';
	div.style.height = rect.height + 1 + 'px';
	div.style.width = rect.width + 1 + 'px';
	div.style.top = rect.top + 'px';
	div.style.left = rect.left + 'px';
	div.style.border = '1px solid blue';
	div.style.animation = 'hide 15000ms forwards';

	const span = document.createElement('span');
	span.style.position = 'fixed';
	span.style.top = rect.top + 'px';
	span.style.left = rect.left + 'px';
	span.textContent = spanText;

	div.appendChild(span);
	return div;
};

const refs = {};

const tracer = new Tracer();

const monkeyPatchTemplate = (instance: LView, isRoot = false) => {
	const origTemplate = instance[1].template;
	instance[1].template = function (...args) {
		console.debug('Calling the original template function');
		origTemplate(...args);
		console.debug('After the original template function');
		const tagName = instance[0].tagName;
		console.log('CD for ', tagName);
		// if (refs[tagName]) {
		//     document.body.removeChild(refs[tagName]);
		// }

		Zone.root.run(() => {
			setTimeout(() => tracer.present(tagName, createMeasurement(instance[0].getBoundingClientRect())));
		});

		// const runOutsideZone = () => {
		//     setTimeout(() => {
		//         // const div = createDiv(instance[0].getBoundingClientRect(), tagName);
		//         // refs[tagName] = div;
		//         // document.body.appendChild(div);
		//         // Zone.root.run(() => {
		//         //     // TODO should this event listener be removed as well?
		//         //     div.addEventListener('animationend', () => {
		//         //         console.log('Removing the div');
		//         //         document.body.removeChild(div);
		//         //         delete refs[tagName];
		//         //     });
		//         // });
		//     });
		// };
		//
		// Zone.root.run(runOutsideZone);
	};
};
//
// const loopComponents = (parentNode) => {
// 	const components = parentNode[1].components;
// 	if (!components) {
// 		return;
// 	}
// 	for (let i = 0; i < components.length; i++) {
// 		console.log('found component ' + parentNode[components[i]][0].tagName);
// 		monkeyPatchTemplate(parentNode[components[i]]);
// 		loopComponents(parentNode[components[i]]);
// 	}
// };

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
			monkeyPatchRootTree(rootLView[CONTEXT] as RootContext);
		} else {
			findRootNode(childNode);
		}
	}
};

console.log('timeout!');

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
	console.log(childLView[HOST].tagName);
	monkeyPatchTemplate(childLView, false);
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
				console.log(dynamicViewData);
				// renderEmbeddedTemplate(dynamicViewData, dynamicViewData[TVIEW], (/** @type {?} */ (dynamicViewData[CONTEXT])));
			}
		}
	}
}


export function monkeyPatchDescendantViews(lView: LView) {
	const tView: TView = lView[TVIEW];

	const creationMode = isCreationMode(lView);

	monkeyPatchChildComponents(tView.components, lView);
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


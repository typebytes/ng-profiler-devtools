import { LView } from './types/angular_core';

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
declare const Zone;



export class Tracer {
	_canvas;
	_pool = new Map();
	_drawing;
	_clearTimer;

	present(lview: LView, tagName, measurement) {
		console.log('updated', tagName, measurement);
		var data;
		if (this._pool.has(lview)) {
			data = this._pool.get(lview);
		} else {
			data = {
				hit: 0,
				tagName,
				...measurement
			};
		}

		data = {
			...data,
			expiration: Date.now() + DURATION,
			hit: data.hit + 1,
		};

		this._pool = this._pool.set(lview, data);

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
		for (let [lView, data] of this._pool.entries()) {
			if (data.expiration < now) {
				// already passed the expiration time.
			} else {
				// TODO what does this even do?
				// console.log('setting', minExpiration);
				minExpiration = Math.min(data.expiration, minExpiration);
				// console.log('setting', minExpiration);
				temp.set(lView, data);
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
		for (const [lView, data] of pool.entries()) {
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

export const createMeasurement = (rect) => {
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

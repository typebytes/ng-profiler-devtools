declare const Zone;

// Id of the canvas node
const CANVAS_NODE_ID = 'TraceUpdatesWebNodePresenter';

// Outline color
const OUTLINE_COLOR = '#f0f0f0';
// Color values used in showing how 'hot' a certain rect is
const COLORS = [
	// coolest
	'#55cef6',
	'#55f67b',
	'#a5f655',
	'#f4f655',
	'#f6a555',
	'#f66855',
	// hottest
	'#ff0000'
];
const HOTTEST_COLOR = COLORS[COLORS.length - 1];

// Duration of the rect being added
const DURATION = 250;

interface TracingMeasurement {
	left: number;
	top: number;
	width: number;
	height: number;
}

interface TracingData {
	hit: number;
	tagName: string;
	expiration: number;
	measurement: TracingMeasurement;
}

export class Tracer {
	// Canvas reference
	canvas: HTMLCanvasElement;
	pool = new Map<string, TracingData>();
	_drawing;
	_clearTimer;

	present(uuid: string, tagName, measurement) {
		let data;
		if (this.pool.has(uuid)) {
			data = this.pool.get(uuid);
		} else {
			data = {
				hit: 0,
				tagName,
				measurement
			};
		}

		data = {
			...data,
			expiration: Date.now() + DURATION,
			hit: data.hit + 1
		};

		this.pool = this.pool.set(uuid, data);

		// If we're already drawing, no use in setting a new event
		if (this._drawing) {
			return;
		}

		this._drawing = true;
		// Draw on the next animationFrame, use Zone to make sure it doesn't trigger a CD cycle in Angular
		Zone.root.run(() => {
			requestAnimationFrame(this._draw.bind(this));
		});
	}

	_draw() {
		const now = Date.now();
		let minExpiration = Number.MAX_VALUE;

		// Calculate the 'nearest' expiration date
		// Remove all the ones that already expired
		const temp = new Map<string, TracingData>();
		for (const [uuid, data] of this.pool.entries()) {
			if (data.expiration > now) {
				minExpiration = Math.min(data.expiration, minExpiration);
				temp.set(uuid, data);
			}
		}
		this.pool = temp;

		this.drawImpl(this.pool);

		if (this.pool.size > 0) {
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
		if (!this._drawing && this.pool.size > 0) {
			this._drawing = true;
			this._draw();
		}
	}

	drawImpl(pool: Map<string, TracingData>) {
		this._ensureCanvas();
		const canvas = this.canvas;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const [uuid, data] of pool.entries()) {
			const color = COLORS[data.hit - 1] || HOTTEST_COLOR;
			drawBorder(ctx, data.measurement, 1, color);
		}
	}

	// TODO: figure out when to call this one
	clearImpl() {
		const canvas = this.canvas;
		if (canvas === null) {
			return;
		}

		if (!canvas.parentNode) {
			return;
		}

		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		canvas.parentNode.removeChild(canvas);
		this.canvas = null;
	}

	_ensureCanvas() {
		let canvas = this.canvas;
		if (canvas === null || canvas === undefined) {
			canvas =
				(window.document.getElementById(CANVAS_NODE_ID) as HTMLCanvasElement) ||
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
			const root = window.document.documentElement;
			root.insertBefore(canvas, root.firstChild);
		}
		this.canvas = canvas;
	}
}

function drawBorder(
	ctx: CanvasRenderingContext2D,
	measurement: TracingMeasurement,
	borderWidth: number,
	borderColor: string
) {
	// outline
	ctx.lineWidth = 1;
	ctx.strokeStyle = OUTLINE_COLOR;

	ctx.strokeRect(
		measurement.left - 1,
		measurement.top - 1,
		measurement.width + 2,
		measurement.height + 2
	);

	// inset
	ctx.lineWidth = 1;
	ctx.strokeStyle = OUTLINE_COLOR;
	ctx.strokeRect(
		measurement.left + borderWidth,
		measurement.top + borderWidth,
		measurement.width - borderWidth,
		measurement.height - borderWidth
	);
	ctx.strokeStyle = borderColor;

	ctx.setLineDash([0]);

	// border
	ctx.lineWidth = borderWidth;
	ctx.strokeRect(
		measurement.left + Math.floor(borderWidth / 2),
		measurement.top + Math.floor(borderWidth / 2),
		measurement.width - borderWidth,
		measurement.height - borderWidth
	);

	ctx.setLineDash([0]);
}

export function createMeasurement(rect: ClientRect) {
	return {
		left: rect.left,
		top: rect.top,
		width: rect.width,
		height: rect.height
	};
}

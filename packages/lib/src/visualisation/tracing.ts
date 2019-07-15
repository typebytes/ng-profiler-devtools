import { PoolData, UpdatePoolManager } from './update-pool-manager';
import { COLORS, HOTTEST_COLOR, OUTLINE_COLOR } from '../constants';

declare const Zone;

// Id of the canvas node
const CANVAS_NODE_ID = 'TraceUpdatesWebNodePresenter';

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

export class Tracer extends UpdatePoolManager<TracingMeasurement> {
	// Canvas reference
	canvas: HTMLCanvasElement;

	present(uuid: string, tagName, measurement) {
		// Add this measurement to the pool of updates
		this.add(uuid, tagName, measurement);
	}

	drawImpl(pool: Map<string, PoolData<TracingMeasurement>>) {
		this.ensureCanvas();
		const canvas = this.canvas;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (const [uuid, data] of pool.entries()) {
			const color = COLORS[data.hit - 1] || HOTTEST_COLOR;
			drawBorder(ctx, data.data, 1, color);
		}
	}

	private ensureCanvas() {
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

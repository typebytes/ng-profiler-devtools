// const CANVAS_NODE_ID = 'TraceUpdatesWebNodePresenter';
//
// const OUTLINE_COLOR = '#f0f0f0';
//
// const COLORS = [
//     // coolest
//     '#55cef6',
//     '#55f67b',
//     '#a5f655',
//     '#f4f655',
//     '#f6a555',
//     '#f66855',
//     // hottest
//     '#ff0000',
// ];
//
// const HOTTEST_COLOR = COLORS[COLORS.length - 1];
// const DURATION = 250;
//
// export class Tracer {
//     canvas;
//     pool = new Map();
//     _drawing;
//
//     present(measurement) {
//         var data;
//         if (this.pool.has(measurement)) {
//             data = this.pool.get(measurement);
//         } else {
//             data = {};
//         }
//
//         data = {
//             expiration: Date.now() + DURATION,
//             hit: data.hit + 1,
//         };
//
//         this.pool = this.pool.set(measurement, data);
//
//         if (this._drawing) {
//             return;
//         }
//
//         this._drawing = true;
//         requestAnimationFrame(this._draw);
//     }
//
//     _draw() {
//         var now = Date.now();
//         var minExpiration = Number.MAX_VALUE;
//
//         this.pool = this.pool.forEach(pool => {
//             for (const [measurement, data] of pool.entries()) {
//                 if (data.expiration < now) {
//                     // already passed the expiration time.
//                     pool.delete(measurement);
//                 } else {
//                     // TODO what does this even do?
//                     minExpiration = Math.min(data.expiration, minExpiration);
//                 }
//             }
//         });
//
//         this.drawImpl(this.pool);
//
//         if (this.pool.size > 0) {
//             if (this._clearTimer != null) {
//                 clearTimeout(this._clearTimer);
//             }
//             this._clearTimer = Zone.root.run(() => {
//                 setTimeout(this._redraw, minExpiration - now);
//             });
//         }
//
//         this._drawing = false;
//     }
//
//     _redraw() {
//         this._clearTimer = null;
//         if (!this._drawing && this.pool.size > 0) {
//             this._drawing = true;
//             this._draw();
//         }
//     }
//
//     drawImpl(pool) {
//         this._ensureCanvas();
//         var canvas = this.canvas;
//         var ctx = canvas.getContext('2d');
//         ctx.clearRect(
//             0,
//             0,
//             canvas.width,
//             canvas.height
//         );
//         for (const [measurement, data] of pool.entries()) {
//             console.log(data.hit);
//             const color = COLORS[data.hit - 1] || HOTTEST_COLOR;
//             drawBorder(ctx, measurement, 1, color);
//         }
//     }
//
//
//     clearImpl() {
//         var canvas = this.canvas;
//         if (canvas === null) {
//             return;
//         }
//
//         if (!canvas.parentNode) {
//             return;
//         }
//
//         var ctx = canvas.getContext('2d');
//         ctx.clearRect(
//             0,
//             0,
//             canvas.width,
//             canvas.height
//         );
//
//         canvas.parentNode.removeChild(canvas);
//         this.canvas = null;
//     }
//
//     _ensureCanvas() {
//         var canvas = this.canvas;
//         if (canvas === null) {
//             canvas =
//                 window.document.getElementById(CANVAS_NODE_ID) ||
//                 window.document.createElement('canvas');
//
//             canvas.id = CANVAS_NODE_ID;
//             canvas.width = window.screen.availWidth;
//             canvas.height = window.screen.availHeight;
//             canvas.style.cssText = `
//         xx-background-color: red;
//         xx-opacity: 0.5;
//         bottom: 0;
//         left: 0;
//         pointer-events: none;
//         position: fixed;
//         right: 0;
//         top: 0;
//         z-index: 1000000000;
//       `;
//         }
//
//         if (!canvas.parentNode) {
//             var root = window.document.documentElement;
//             root.insertBefore(canvas, root.firstChild);
//         }
//         this.canvas = canvas;
//     }
// }
//
//
// function drawBorder(ctx, measurement, borderWidth, borderColor) {
//     // outline
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = OUTLINE_COLOR;
//
//     ctx.strokeRect(
//         measurement.left- 1,
//         measurement.top - 1,
//         measurement.width + 2,
//         measurement.height + 2,
//     );
//
//     // inset
//     ctx.lineWidth = 1;
//     ctx.strokeStyle = OUTLINE_COLOR;
//     ctx.strokeRect(
//         measurement.left + borderWidth,
//         measurement.top + borderWidth,
//         measurement.width - borderWidth,
//         measurement.height - borderWidth,
//     );
//     ctx.strokeStyle = borderColor;
//
//
//     // if (measurement.should_update) {
//         ctx.setLineDash([2]);
//     // } else {
//     //     ctx.setLineDash([0]);
//     // }
//
//     // border
//     ctx.lineWidth = '' + borderWidth;
//     ctx.strokeRect(
//         measurement.left + Math.floor(borderWidth / 2),
//         measurement.top + Math.floor(borderWidth / 2),
//         measurement.width - borderWidth,
//         measurement.height - borderWidth,
//     );
//
//     ctx.setLineDash([0]);
// }
//

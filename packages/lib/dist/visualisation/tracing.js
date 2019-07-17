"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
var update_pool_manager_1 = require("./update-pool-manager");
var constants_1 = require("../constants");
// Id of the canvas node
var CANVAS_NODE_ID = 'TraceUpdatesWebNodePresenter';
var Tracer = /** @class */ (function (_super) {
    __extends(Tracer, _super);
    function Tracer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tracer.prototype.present = function (uuid, tagName, measurement) {
        // Add this measurement to the pool of updates
        this.add(uuid, tagName, measurement);
    };
    Tracer.prototype.drawImpl = function (pool) {
        var e_1, _a;
        this.ensureCanvas();
        var canvas = this.canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        try {
            for (var _b = __values(pool.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), uuid = _d[0], data = _d[1];
                var color = constants_1.COLORS[data.hit - 1] || constants_1.HOTTEST_COLOR;
                drawBorder(ctx, data.data, 1, color);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Tracer.prototype.ensureCanvas = function () {
        var canvas = this.canvas;
        if (canvas === null || canvas === undefined) {
            canvas =
                window.document.getElementById(CANVAS_NODE_ID) ||
                    window.document.createElement('canvas');
            canvas.id = CANVAS_NODE_ID;
            canvas.width = window.screen.availWidth;
            canvas.height = window.screen.availHeight;
            canvas.style.cssText = "\n        xx-background-color: red;\n        xx-opacity: 0.5;\n        bottom: 0;\n        left: 0;\n        pointer-events: none;\n        position: fixed;\n        right: 0;\n        top: 0;\n        z-index: 1000000000;\n      ";
        }
        if (!canvas.parentNode) {
            var root = window.document.documentElement;
            root.insertBefore(canvas, root.firstChild);
        }
        this.canvas = canvas;
    };
    return Tracer;
}(update_pool_manager_1.UpdatePoolManager));
exports.Tracer = Tracer;
function drawBorder(ctx, measurement, borderWidth, borderColor) {
    // outline
    ctx.lineWidth = 1;
    ctx.strokeStyle = constants_1.OUTLINE_COLOR;
    ctx.strokeRect(measurement.left - 1, measurement.top - 1, measurement.width + 2, measurement.height + 2);
    // inset
    ctx.lineWidth = 1;
    ctx.strokeStyle = constants_1.OUTLINE_COLOR;
    ctx.strokeRect(measurement.left + borderWidth, measurement.top + borderWidth, measurement.width - borderWidth, measurement.height - borderWidth);
    ctx.strokeStyle = borderColor;
    ctx.setLineDash([0]);
    // border
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(measurement.left + Math.floor(borderWidth / 2), measurement.top + Math.floor(borderWidth / 2), measurement.width - borderWidth, measurement.height - borderWidth);
    ctx.setLineDash([0]);
}
function createMeasurement(rect) {
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
    };
}
exports.createMeasurement = createMeasurement;
//# sourceMappingURL=tracing.js.map
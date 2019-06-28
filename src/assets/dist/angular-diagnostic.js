var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var CANVAS_NODE_ID = 'TraceUpdatesWebNodePresenter';
var OUTLINE_COLOR = '#f0f0f0';
var COLORS = [
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
var HOTTEST_COLOR = COLORS[COLORS.length - 1];
var DURATION = 250;
var Tracer = /** @class */ (function () {
    function Tracer() {
        this._pool = new Map();
    }
    Tracer.prototype.present = function (tagName, measurement) {
        var _this = this;
        var data;
        if (this._pool.has(tagName)) {
            console.log('old measurement');
            data = this._pool.get(tagName);
        }
        else {
            console.log('new measurement');
            data = __assign({ hit: 0 }, measurement);
        }
        data = __assign({}, data, { expiration: Date.now() + DURATION, hit: data.hit + 1 });
        this._pool = this._pool.set(tagName, data);
        if (this._drawing) {
            return;
        }
        this._drawing = true;
        Zone.root.run(function () {
            requestAnimationFrame(_this._draw.bind(_this));
        });
    };
    Tracer.prototype._draw = function () {
        var _this = this;
        var e_1, _a;
        var now = Date.now();
        var minExpiration = Number.MAX_VALUE;
        var temp = new Map();
        try {
            for (var _b = __values(this._pool.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), tagName = _d[0], data = _d[1];
                if (data.expiration < now) {
                    // already passed the expiration time.
                }
                else {
                    // TODO what does this even do?
                    // console.log('setting', minExpiration);
                    minExpiration = Math.min(data.expiration, minExpiration);
                    // console.log('setting', minExpiration);
                    temp.set(tagName, data);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._pool = temp;
        this.drawImpl(this._pool);
        if (this._pool.size > 0) {
            // debugger;
            if (this._clearTimer != null) {
                clearTimeout(this._clearTimer);
            }
            this._clearTimer = Zone.root.run(function () {
                setTimeout(_this._redraw.bind(_this), minExpiration - now);
            });
        }
        this._drawing = false;
    };
    Tracer.prototype._redraw = function () {
        this._clearTimer = null;
        if (!this._drawing && this._pool.size > 0) {
            this._drawing = true;
            this._draw();
        }
    };
    Tracer.prototype.drawImpl = function (pool) {
        var e_2, _a;
        this._ensureCanvas();
        var canvas = this._canvas;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log(pool);
        try {
            for (var _b = __values(pool.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), tagName = _d[0], data = _d[1];
                console.log(data.hit);
                var color = COLORS[data.hit - 1] || HOTTEST_COLOR;
                drawBorder(ctx, data, 1, color);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Tracer.prototype.clearImpl = function () {
        var canvas = this._canvas;
        if (canvas === null) {
            return;
        }
        if (!canvas.parentNode) {
            return;
        }
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.parentNode.removeChild(canvas);
        this._canvas = null;
    };
    Tracer.prototype._ensureCanvas = function () {
        var canvas = this._canvas;
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
        this._canvas = canvas;
    };
    return Tracer;
}());
function drawBorder(ctx, measurement, borderWidth, borderColor) {
    // outline
    ctx.lineWidth = 1;
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.strokeRect(measurement.left - 1, measurement.top - 1, measurement.width + 2, measurement.height + 2);
    // inset
    ctx.lineWidth = 1;
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.strokeRect(measurement.left + borderWidth, measurement.top + borderWidth, measurement.width - borderWidth, measurement.height - borderWidth);
    ctx.strokeStyle = borderColor;
    // if (measurement.should_update) {
    ctx.setLineDash([0]);
    // } else {
    //     ctx.setLineDash([0]);
    // }
    // border
    ctx.lineWidth = '' + borderWidth;
    ctx.strokeRect(measurement.left + Math.floor(borderWidth / 2), measurement.top + Math.floor(borderWidth / 2), measurement.width - borderWidth, measurement.height - borderWidth);
    ctx.setLineDash([0]);
}
var borderRemovals = [];
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
var createMeasurement = function (rect) {
    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
    };
};
var createDiv = function (rect, spanText) {
    var div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.height = rect.height + 1 + 'px';
    div.style.width = rect.width + 1 + 'px';
    div.style.top = rect.top + 'px';
    div.style.left = rect.left + 'px';
    div.style.border = '1px solid blue';
    div.style.animation = 'hide 15000ms forwards';
    var span = document.createElement('span');
    span.style.position = 'fixed';
    span.style.top = rect.top + 'px';
    span.style.left = rect.left + 'px';
    span.textContent = spanText;
    div.appendChild(span);
    return div;
};
var refs = {};
var tracer = new Tracer();
var monkeyPatchTemplate = function (instance, isRoot) {
    if (isRoot === void 0) { isRoot = false; }
    var origTemplate = instance[1].template;
    instance[1].template = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.debug('Calling the original template function');
        origTemplate.apply(void 0, __spread(args));
        console.debug('After the original template function');
        var tagName = instance[0].tagName;
        console.log('CD for ', tagName);
        // if (refs[tagName]) {
        //     document.body.removeChild(refs[tagName]);
        // }
        Zone.root.run(function () {
            setTimeout(function () { return tracer.present(tagName, createMeasurement(instance[0].getBoundingClientRect())); });
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
var loopComponents = function (parentNode) {
    var components = parentNode[1].components;
    if (!components) {
        return;
    }
    for (var i = 0; i < components.length; i++) {
        console.log('found component ' + parentNode[components[i]][0].tagName);
        monkeyPatchTemplate(parentNode[components[i]]);
        loopComponents(parentNode[components[i]]);
    }
};
var findRootNode = function (node) {
    if (!node || !node.childNodes) {
        return;
    }
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var childNode = childNodes[i];
        if (childNode.__ngContext__) {
            var instance = childNode.__ngContext__.debug._raw_lView[20];
            monkeyPatchTemplate(instance, true);
            loopComponents(instance);
        }
        else {
            findRootNode(childNode);
        }
    }
};
setTimeout(function () {
    console.debug('booting the plugin');
    findRootNode(document.body);
}, 2000);

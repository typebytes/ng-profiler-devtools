"use strict";
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
exports.__esModule = true;
// Duration of the rect being added
var DURATION = 250;
var UpdatePoolManager = /** @class */ (function () {
    function UpdatePoolManager() {
        this.pool = new Map();
        this.drawing = false;
    }
    UpdatePoolManager.prototype.addAll = function (items) {
        var e_1, _a;
        try {
            for (var _b = __values(items.entries
                ? items.entries()
                : Object.entries(items)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), uuid = _d[0], dataToAdd = _d[1];
                // console.log('pool length', this.pool.size);
                var data = void 0;
                if (this.pool.has(uuid)) {
                    data = this.pool.get(uuid);
                }
                else {
                    data = {
                        hit: 0,
                        tagName: dataToAdd.tagName,
                        data: dataToAdd
                    };
                }
                // console.log(data);
                data = __assign({}, data, { expiration: Date.now() + DURATION, hit: data.hit + 1 });
                // console.log(data);
                this.pool.set(uuid, data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.scheduleDraw();
    };
    UpdatePoolManager.prototype.add = function (uuid, tagName, dataToAdd) {
        var data;
        if (this.pool.has(uuid)) {
            data = this.pool.get(uuid);
        }
        else {
            data = {
                hit: 0,
                tagName: tagName,
                data: dataToAdd
            };
        }
        data = __assign({}, data, { expiration: Date.now() + DURATION, hit: data.hit + 1 });
        this.pool = this.pool.set(uuid, data);
        this.scheduleDraw();
    };
    UpdatePoolManager.prototype.firstExpirationDate = function () {
        var e_2, _a;
        var now = Date.now();
        var minExpiration = Number.MAX_VALUE;
        // Calculate the 'nearest' expiration date
        // Remove all the ones that already expired
        var temp = new Map();
        try {
            for (var _b = __values(this.pool.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), uuid = _d[0], data = _d[1];
                if (data.expiration > now) {
                    minExpiration = Math.min(data.expiration, minExpiration);
                    temp.set(uuid, data);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.pool = temp;
        return minExpiration;
    };
    UpdatePoolManager.prototype.draw = function () {
        var now = Date.now();
        var minExpiration = this.firstExpirationDate();
        this.drawImpl(this.pool);
        if (this.pool.size > 0) {
            if (this.clearTimer != null) {
                clearTimeout(this.clearTimer);
            }
            this.clearTimer = setTimeout(this.redraw.bind(this), minExpiration - now);
        }
        this.drawing = false;
    };
    UpdatePoolManager.prototype.redraw = function () {
        this.clearTimer = null;
        if (!this.drawing && this.pool.size > 0) {
            this.drawing = true;
            this.draw();
        }
    };
    UpdatePoolManager.prototype.scheduleDraw = function () {
        // If we're already drawing, no use in setting a new event
        if (this.drawing) {
            return;
        }
        // FIXME fix this shit
        this.drawing = true;
        // Draw on the next animationFrame, use Zone to make sure it doesn't trigger a CD cycle in Angular
        // if (Zone) {
        //   Zone.root.run(() => {
        requestAnimationFrame(this.draw.bind(this));
        //   });
        // } else {
        // scheduleOutsideOfZone(() => requestAnimationFrame(this.draw.bind(this)));
        // }
    };
    return UpdatePoolManager;
}());
exports.UpdatePoolManager = UpdatePoolManager;
//# sourceMappingURL=update-pool-manager.js.map
// const origSetTimeout = window.setTimeout;
// window.setTimeout = function(...args) {
//
// };
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
const DURATION = 2500;

class Tracer {
    _canvas;
    _pool = new Map();
    _drawing;

    present(measurement) {
        console.log('new measurement');
        var data;
        if (this._pool.has(measurement)) {
            data = this._pool.get(measurement);
        } else {
            data = {};
        }

        data = {
            expiration: Date.now() + DURATION,
            hit: data.hit + 1,
        };

        this._pool = this._pool.set(measurement, data);

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
        for (let [measurement, data] of this._pool.entries()) {
            if (data.expiration < now) {
                // already passed the expiration time.
            } else {
                // TODO what does this even do?
                console.log('setting', minExpiration);
                minExpiration = Math.min(data.expiration, minExpiration);
                console.log('setting', minExpiration);
                temp.set(measurement, data);
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
        console.log('set drawing false');
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
        for (const [measurement, data] of pool.entries()) {
            const color = COLORS[data.hit - 1] || HOTTEST_COLOR;
            drawBorder(ctx, measurement, 1, color);
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
    }
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

const monkeyPatchTemplate = (instance, isRoot = false) => {
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

        tracer.present(createMeasurement(instance[0].getBoundingClientRect()));
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
    }
};

const loopComponents = (parentNode) => {
    const components = parentNode[1].components;
    if (!components) {
        return;
    }
    for (let i = 0; i < components.length; i++) {
        console.log('found component ' + parentNode[components[i]][0].tagName);
        monkeyPatchTemplate(parentNode[components[i]]);
        loopComponents(parentNode[components[i]]);
    }
};

const findRootNode = (node) => {
        if (!node || !node.childNodes) {
            return;
        }
        const childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            let childNode = childNodes[i];
            if (childNode.__ngContext__) {
                const instance = childNode.__ngContext__.debug._raw_lView[20];
                monkeyPatchTemplate(instance, true);
                loopComponents(instance)
            } else {
                findRootNode(childNode);
            }
        }
    }
;

setTimeout(() => {
    console.debug('booting the plugin');

    findRootNode(document.body);
}, 2000);



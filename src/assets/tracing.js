// const origSetTimeout = window.setTimeout;
// window.setTimeout = function(...args) {
//
// };

import {TracePresenter} from "./tracing";

let borderRemovals = [];

const presenter = new TracePresenter();

//
// export type Measurement = {
// 	bottom: number,
// 	expiration: number,
// 	height: number,
// 	id: string,
// 	left: number,
// 	right: number,
// 	scrollX: number,
// 	scrollY: number,
// 	top: number,
// 	width: number,
// };

const monkeyPatchTemplate = (instance, isRoot = false) => {
    let triggers = {pluginTriggered: false, borderShown: false};
    const origTemplate = instance[1].template;
    let timeoutId;
    instance[1].template = function (...args) {
        const tagName = instance[0].tagName;
        console.log('CD for ', tagName);
        console.debug(`Triggers for ${tagName}: ${JSON.stringify(triggers)}`);
        // if (triggers.pluginTriggered) {
        // 	triggers.pluginTriggered = false;
        // 	console.debug('Plugin triggered CD, returning');
        // 	return;
        // }
        const div = document.createElement('div');
        const rect = instance[0].getBoundingClientRect();
        div.style.position = 'fixed';
        div.style.height = rect.height + 'px';
        div.style.width = rect.width + 'px';
        div.style.top = rect.top + 'px';
        div.style.left = rect.left + 'px';
        div.style.border = '1px solid blue';
        div.style.animation = 'hide 1500ms forwards';
        document.body.appendChild(div);
        Zone.root.run(() => {
            div.addEventListener('animationend', () => {
                console.log('end');
                console.log('will this trigger CD');
                document.body.removeChild(div);
            });
        });
        // triggers.borderShown = true;
        // console.debug('Adding the border to the list');
        // borderRemovals.push({
        // 		ref: triggers,
        // 		clear: () => {
        // 			document.body.removeChild(div);
        // 		}
        // 	}
        // );
        if (isRoot) {
            console.debug('Working for the root element');
            if (triggers.borderShown) {
                // console.debug('Clearing the previous timeout');
                // clearTimeout(timeoutId);
            }
            // console.debug('Setting a new timeout');
            // timeoutId = setTimeout(() => {
            // 	console.debug('Going to execute every borderRemoval');
            // 	const copy = [...borderRemovals];
            // 	console.debug('Copy', copy, borderRemovals);
            // 	borderRemovals = [];
            // 	copy.forEach((removal) => {
            // 		console.debug('Calling the border removal');
            // 		removal.clear();
            // 		console.debug('• the CD triggered by the plugin');
            // 		removal.ref.pluginTriggered = true;
            // 		removal.ref.borderShown = false;
            // 	});
            // }, 1500);
        }
        console.debug('Calling the original template function');
        origTemplate(...args);
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



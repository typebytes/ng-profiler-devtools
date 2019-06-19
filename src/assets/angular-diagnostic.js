// const origSetTimeout = window.setTimeout;
// window.setTimeout = function(...args) {
//
// };

let borderRemovals = [];

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

const monkeyPatchTemplate = (instance, isRoot = false) => {
    const origTemplate = instance[1].template;
    instance[1].template = function (...args) {
        console.debug('Calling the original template function');
        origTemplate(...args);
        console.debug('After the original template function');
        const tagName = instance[0].tagName;
        console.log('CD for ', tagName);
        if(refs[tagName]) {
            document.body.removeChild(refs[tagName]);
        }

        const runOutsideZone = () => {
            setTimeout(() => {
                const div = createDiv(instance[0].getBoundingClientRect(), tagName);
                refs[tagName] = div;
                document.body.appendChild(div);
                Zone.root.run(() => {
                    // TODO should this event listener be removed as well?
                    div.addEventListener('animationend', () => {
                        console.log('Removing the div');
                        document.body.removeChild(div);
                        delete refs[tagName];
                    });
                });
            });
        };

        Zone.root.run(runOutsideZone);
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



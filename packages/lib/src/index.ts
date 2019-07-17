import { findAngularRootNode } from './util';
import { monkeyPatchRootNode, undoMonkeyPatch } from './devtool';
import { CONTEXT, RootContext } from './types/angular_core';

export * from './tree-view-builder';
export * from './visualisation';

declare const document;

export function startTracing() {
	setTimeout(() => {
		const angularRootNode = findAngularRootNode(document.body);
		if (angularRootNode) {
			monkeyPatchRootNode(angularRootNode[
				CONTEXT
				] as RootContext);
		}
	}, 2000);
}

export function stopTracing() {
	undoMonkeyPatch();
}

export function isAngularApp() {
	console.log('trying to find angular root node', findAngularRootNode(document.body));
	return findAngularRootNode(document.body) !== undefined;
}


import { findAngularRootNode } from './util';
import { monkeyPatchRootNode } from './devtool';
import { CONTEXT, RootContext } from './types/angular_core';

export function start() {
	setTimeout(() =>
		monkeyPatchRootNode(findAngularRootNode(document.body)[
			CONTEXT
		] as RootContext)
	);
}

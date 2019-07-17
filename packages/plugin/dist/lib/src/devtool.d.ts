import { LView, RootContext } from './types/angular_core';
export declare function monkeyPatchDirectChildren(lView: LView, isRoot?: boolean): void;
export declare function monkeyPatchRootNode(rootContext: RootContext): void;
export declare function undoMonkeyPatch(): void;

import { LContainer, LView } from './types/angular_core';
import { SerializedTreeViewItem, TreeViewItem } from './tree-view-builder';
export declare function loopDynamicEmbeddedViews({ lView, work, nextCurrentLContainer, nextViewRefIndex, exitLoopPrematurely }: {
    lView: LView;
    work: (nextLView: LView, lastViewRef: boolean, currentViewRefIndex: number, nextLContainer: LContainer) => void;
    nextCurrentLContainer?: LContainer;
    nextViewRefIndex?: number;
    exitLoopPrematurely?: boolean;
}): boolean;
export declare function loopChildComponents({ lView, work, exitLoopPrematurely }: {
    lView: LView;
    work: (lView: LView) => void;
    exitLoopPrematurely?: boolean;
}): boolean;
export declare function traverseTreeAndCreateTreeStructure(rootLView: LView, isRoot: boolean): any;
export declare function traverseTreeAndCreateInstructions(rootLView: LView, isRoot: boolean): any;
export declare function transformTreeToInstructions(inputTreeViewItem: SerializedTreeViewItem): Map<string, SerializedTreeViewItem>;
export declare function getRealParent(treeViewItem: TreeViewItem): any;

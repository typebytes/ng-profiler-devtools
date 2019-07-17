import { LView } from './types/angular_core';
export interface SerializedTreeViewItem {
    uuid: string;
    children: SerializedTreeViewItem[];
    onPush: boolean;
    tagName: string;
}
export interface TreeViewItem {
    lView: LView;
    currentIndex: number;
    children: TreeViewItem[];
    currentViewRefIndex?: number;
    parent?: TreeViewItem;
    isRoot: boolean;
    nextCurrent?: any;
    dynamicEmbeddedViewsChecked?: boolean;
}
export declare class TreeViewBuilder {
    rootTreeViewItem: TreeViewItem;
    currentTreeViewItem: TreeViewItem;
    constructor();
    addTreeViewItem(childTreeViewItem: TreeViewItem, parentTreeViewItem?: TreeViewItem): void;
}
export declare function serialiseTreeViewItem(treeViewItem: TreeViewItem): SerializedTreeViewItem;
export declare function createInitialTreeViewState(lView: LView, isRoot: boolean, parent?: TreeViewItem): TreeViewItem;

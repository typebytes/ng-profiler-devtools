import { LView } from './types/angular_core';
import { TreeViewItem } from './tree-view-builder';
/**
 * This class encapsulates the same logic used by the Angular Ivy renderer to determine what the next view is to be checked.
 *
 * Internally, Angular manages a property 'lView' which points to the current view to be checked. Unfortunately, it's impossible
 * to reference this property by using a runtime dependency. We do need this know which view is currently being checked to link
 * the correct lView with the correct template function execution. By linking this info we can figure out which component is checked
 * and which one is not.
 *
 * The class exposes the predictedNextLView property which is the predicted lView to be checked. By calling the getNextLView function
 * the pointer is set to the next predicted one. This is done by mimicking the tree traversal that Angular does internally. Every time this
 * traversal is updated, this file will need to be as well!
 *
 * Call the resetState function to reset the initial state between different loops.
 */
export declare class LViewStateManager {
    predictedNextLView: LView;
    private treeViewBuilder;
    /**
     * Function will change the pointer to the predictedNextLView parameter to the one Angular called the template function for.
     *
     * EVERY call will change the pointer to the next lView. Meaning, every call will traverse the tree from where it left of and will
     * try to find the next one
     *
     * @param treeViewItem
     * @param rootLView
     */
    getNextLView(treeViewItem?: TreeViewItem, rootLView?: LView): TreeViewItem;
    resetState(): void;
    getTree(): TreeViewItem;
}

import { LContainer, LView, TVIEW } from './types/angular_core';
import { shouldLViewBeChecked } from './util';
import { loopDynamicEmbeddedViews } from './tree-traversal';
import { TreeViewBuilder, TreeViewItem } from './tree-view-builder';

/**
 * This class encapsulates the same logic used by the Angular Ivy renderer to determine what the next view is to be checked.
 *
 * Internally, Angular manages a property 'lView' which points to the current view to be checked. Unfortunately, it's impossible
 * to reference this property by using a runtime dependency. We do need this know which view is currently being checked to link
 * the correct lView with the correct template function execution. By linking this info we can figure out which component is checked
 * and which one is not.
 *
 * The class exposes the predictedNextLView property which is the predicted lView to be checked. By calling the getNextLView function
 * the pointer is set to the next predicted one.
 *
 * Call the resetState function to reset the initial state between different loops.
 */
export class LViewStateManager {
	// The currently predicted lView that's gonna be checked
	predictedNextLView: LView;

	// TreeViewBuilder that will be filled with all predictedLViews
	treeViewBuilder: TreeViewBuilder;

	/**
	 * Function will change the pointer to the predictedNextLView parameter to the one Angular called the template function for.
	 *
	 * EVERY call will change the pointer to the next lView. Meaning, every call will traverse the tree from where it left of and will
	 * try to find the next one
	 *
	 * @param treeViewItem
	 * @param rootLView
	 */
	getNextLView(treeViewItem?: TreeViewItem, rootLView?: LView): TreeViewItem {
		// If there is no current predictedLView it MUST be the current iteration
		if (!this.predictedNextLView) {
			const rootTreeViewItem = this.initialiseState(rootLView);
			this.treeViewBuilder = new TreeViewBuilder();
			this.treeViewBuilder.addTreeViewItem(rootTreeViewItem);
			this.predictedNextLView = rootLView;
			return;
		}

		// If no treeViewItem was passed, take the last one we were working with
		if (!treeViewItem) {
			treeViewItem = this.treeViewBuilder.currentTreeViewItem;
		}

		// Loop over all the dynamicEmbeddedViews
		if (!treeViewItem.dynamicEmbeddedViewsChecked) {
			// When a dynamic embedded view is found
			const whenDynamicEmbeddedViewFound = (
				dynamicLView: LView,
				lastViewRef: boolean,
				currentViewRefIndex: number,
				nextLContainer: LContainer
			) => {
				// if it was the last viewRef for that LContainer, we need to update the pointer so the next loop doesn't revisit it
				if (lastViewRef) {
					treeViewItem.nextCurrent = nextLContainer;
				} else {
					// If not, we need to update the index of the current viewRef so we don't revisit that one again
					treeViewItem.currentViewRefIndex = currentViewRefIndex + 1;
				}
				this.getNextLView({
					lView: dynamicLView,
					currentIndex: 0,
					children: [],
					parent: treeViewItem,
					isRoot: false
				});
			};

			// Call the tree traversal for dynamicEmbeddedViews, exit the loop whenever we hit something. We only want to visit the
			// first node and continue to the next on the next traversal.
			const foundADynamicEmbeddedView = loopDynamicEmbeddedViews({
				lView: treeViewItem.lView,
				work: whenDynamicEmbeddedViewFound,
				nextCurrentLContainer: treeViewItem.nextCurrent,
				nextViewRefIndex: treeViewItem.currentViewRefIndex,
				exitLoopPrematurely: true
			});
			// If a dynamic view was found, we need to stop looping, if not, we need to check the current lView's child components
			if (foundADynamicEmbeddedView) {
				return;
			}
			// Label this so we don't accidentally loop over all the dynamic embedded views again
			treeViewItem.dynamicEmbeddedViewsChecked = true;
		}

		// Check the child components
		const components = treeViewItem.lView[TVIEW].components;

		if (!components || treeViewItem.currentIndex >= components.length) {
			if (!treeViewItem.isRoot) {
				this.getNextLView(treeViewItem.parent);
				return;
			}
			return;
		}
		const potentialLView =
			treeViewItem.lView[components[treeViewItem.currentIndex]];
		if (!treeViewItem.isRoot && shouldLViewBeChecked(potentialLView)) {
			treeViewItem.currentIndex++;
			this.getNextLView(treeViewItem);
			return;
		}
		this.predictedNextLView =
			treeViewItem.lView[components[treeViewItem.currentIndex]] ||
			treeViewItem.lView;
		treeViewItem.currentIndex++;
		const childTreeViewItem = {
			lView: this.predictedNextLView,
			currentIndex: 0,
			children: [],
			parent: treeViewItem,
			isRoot: false
		};
		this.treeViewBuilder.addTreeViewItem(childTreeViewItem, treeViewItem);
	}

	resetState() {
		this.predictedNextLView = null;
	}

	private initialiseState(lView) {
		console.log('initialised');
		return {
			lView,
			currentIndex: 0,
			children: [],
			isRoot: true
		};
	}
}

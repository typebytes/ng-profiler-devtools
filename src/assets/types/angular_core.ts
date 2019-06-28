import { ɵPlayerHandler } from '@angular/core';

export interface RootContext {
	/**
	 * A function used for scheduling change detection in the future. Usually
	 * this is `requestAnimationFrame`.
	 */
	scheduler: (workFn: () => void) => void;
	/**
	 * A promise which is resolved when all components are considered clean (not dirty).
	 *
	 * This promise is overwritten every time a first call to {@link markDirty} is invoked.
	 */
	clean: Promise<null>;
	/**
	 * RootComponents - The components that were instantiated by the call to
	 * {@link renderComponent}.
	 */
	components: {}[];
	/**
	 * The player flushing handler to kick off all animations
	 */
	playerHandler: ɵPlayerHandler | null;
	/**
	 * What render-related operations to run once a scheduler has been set
	 */
	flags: RootContextFlags;
}

export const enum RootContextFlags {
	Empty = 0,
	DetectChanges = 1,
	FlushPlayers = 2
}

export const MONKEY_PATCH_KEY_NAME = '__ngContext__';


// Below are constants for LView indices to help us look up LView members
// without having to remember the specific indices.
// Uglify will inline these when minifying so there shouldn't be a cost.
export const HOST = 0;
export const TVIEW = 1;
export const FLAGS = 2;
export const PARENT = 3;
export const NEXT = 4;
export const QUERIES = 5;
export const T_HOST = 6;
export const BINDING_INDEX = 7;
export const CLEANUP = 8;
export const CONTEXT = 9;
export const INJECTOR = 10;
export const RENDERER_FACTORY = 11;
export const RENDERER = 12;
export const SANITIZER = 13;
export const CHILD_HEAD = 14;
export const CHILD_TAIL = 15;
export const CONTENT_QUERIES = 16;
export const DECLARATION_VIEW = 17;
export const PREORDER_HOOK_FLAGS = 18;
/** Size of LView's header. Necessary to adjust for it when setting slots.  */
export const HEADER_OFFSET = 20;

export interface TView {

}


export interface LContainer extends Array<any> {

}


export interface LView extends Array<any> {
	/**
	 * The host node for this LView instance, if this is a component view.
	 *
	 * If this is an embedded view, HOST will be null.
	 *
	 * If the component uses host bindings for styling that the `RElement` will be wrapped with
	 * `StylingContext`.
	 */
		[HOST]: any; // RElement|StylingContext|null;

	/**
	 * The static data for this view. We need a reference to this so we can easily walk up the
	 * node tree in DI and get the TView.data array associated with a node (where the
	 * directive defs are stored).
	 */
	readonly[TVIEW]: TView;


	[PARENT]: LView | LContainer | null;

	/**
	 *
	 * The next sibling LView or LContainer.
	 *
	 * Allows us to propagate between sibling view states that aren't in the same
	 * container. Embedded views already have a node.next, but it is only set for
	 * views in the same container. We need a way to link component views and views
	 * across containers as well.
	 */
		[NEXT]: LView | LContainer | null;


	/**
	 * - For dynamic views, this is the context with which to render the template (e.g.
	 *   `NgForContext`), or `{}` if not defined explicitly.
	 * - For root view of the root component the context contains change detection data.
	 * - For non-root components, the context is the component instance,
	 * - For inline views, the context is null.
	 */
		[CONTEXT]: {} | RootContext | null;

	/**
	 * Reference to the first LView or LContainer beneath this LView in
	 * the hierarchy.
	 *
	 * Necessary to store this so views can traverse through their nested views
	 * to remove listeners and call onDestroy callbacks.
	 */
		[CHILD_HEAD]: LView | LContainer | null;

	/**
	 * The last LView or LContainer beneath this LView in the hierarchy.
	 *
	 * The tail allows us to quickly add a new state to the end of the view list
	 * without having to propagate starting from the first child.
	 */
		[CHILD_TAIL]: LView | LContainer | null;


	/**
	 * View where this view's template was declared.
	 *
	 * Only applicable for dynamically created views. Will be null for inline/component views.
	 *
	 * The template for a dynamically created view may be declared in a different view than
	 * it is inserted. We already track the "insertion view" (view where the template was
	 * inserted) in LView[PARENT], but we also need access to the "declaration view"
	 * (view where the template was declared). Otherwise, we wouldn't be able to call the
	 * view's template function with the proper contexts. Context should be inherited from
	 * the declaration view tree, not the insertion view tree.
	 *
	 * Example (AppComponent template):
	 *
	 * <ng-template #foo></ng-template>       <-- declared here -->
	 * <some-comp [tpl]="foo"></some-comp>    <-- inserted inside this component -->
	 *
	 * The <ng-template> above is declared in the AppComponent template, but it will be passed into
	 * SomeComp and inserted there. In this case, the declaration view would be the AppComponent,
	 * but the insertion view would be SomeComp. When we are removing views, we would want to
	 * traverse through the insertion view to clean up listeners. When we are calling the
	 * template function during change detection, we need the declaration view to get inherited
	 * context.
	 */
		[DECLARATION_VIEW]: LView | null;
}


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
	playerHandler: any | null;
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

export const ACTIVE_INDEX = 2;
// PARENT, NEXT, QUERIES and T_HOST are indices 3, 4, 5 and 6.
// As we already have these constants in LView, we don't need to re-create them.
export const NATIVE = 7;
export const VIEW_REFS = 8;

/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
export const TYPE = 1;

export interface TView {
	template: Function | null;

	/** Whether or not this template has been processed. */
	firstTemplatePass: boolean;

	components: number[] | null;
}

/**
 * Non original one
 *
 * Definition of what a template rendering function should look like for a component.
 */
// export interface ComponentTemplate {
// }

export interface LContainer extends Array<any> {}

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
	readonly [TVIEW]: TView;

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

export interface LContext {
	/**
	 * The component's parent view data.
	 */
	lView: LView;

	/**
	 * The index instance of the node.
	 */
	nodeIndex: number;

	/**
	 * The instance of the Component node.
	 */
	component: {} | null | undefined;

	/**
	 * The list of active directives that exist on this element.
	 */
	directives: any[] | null | undefined;

	/**
	 * The map of local references (local reference name => element or directive instance) that exist
	 * on this element.
	 */
	localRefs: { [key: string]: any } | null | undefined;
}

/** Flags associated with an LView (saved in LView[FLAGS]) */
export const enum LViewFlags {
	/** The state of the init phase on the first 2 bits */
	InitPhaseStateIncrementer = 0b00000000001,
	InitPhaseStateMask = 0b00000000011,

	/**
	 * Whether or not the view is in creationMode.
	 *
	 * This must be stored in the view rather than using `data` as a marker so that
	 * we can properly support embedded views. Otherwise, when exiting a child view
	 * back into the parent view, `data` will be defined and `creationMode` will be
	 * improperly reported as false.
	 */
	CreationMode = 0b00000000100,

	/**
	 * Whether or not this LView instance is on its first processing pass.
	 *
	 * An LView instance is considered to be on its "first pass" until it
	 * has completed one creation mode run and one update mode run. At this
	 * time, the flag is turned off.
	 */
	FirstLViewPass = 0b00000001000,

	/** Whether this view has default change detection strategy (checks always) or onPush */
	CheckAlways = 0b00000010000,

	/**
	 * Whether or not manual change detection is turned on for onPush components.
	 *
	 * This is a special mode that only marks components dirty in two cases:
	 * 1) There has been a change to an @Input property
	 * 2) `markDirty()` has been called manually by the user
	 *
	 * Note that in this mode, the firing of events does NOT mark components
	 * dirty automatically.
	 *
	 * Manual mode is turned off by default for backwards compatibility, as events
	 * automatically mark OnPush components dirty in View Engine.
	 *
	 * TODO: Add a public API to ChangeDetectionStrategy to turn this mode on
	 */
	ManualOnPush = 0b00000100000,

	/** Whether or not this view is currently dirty (needing check) */
	Dirty = 0b000001000000,

	/** Whether or not this view is currently attached to change detection tree. */
	Attached = 0b000010000000,

	/** Whether or not this view is destroyed. */
	Destroyed = 0b000100000000,

	/** Whether or not this view is the root view */
	IsRoot = 0b001000000000,

	/**
	 * Index of the current init phase on last 22 bits
	 */
	IndexWithinInitPhaseIncrementer = 0b010000000000,
	IndexWithinInitPhaseShift = 10,
	IndexWithinInitPhaseReset = 0b001111111111
}

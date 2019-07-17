export interface RootContext {
    /**
     * RootComponents - The components that were instantiated by the call to
     * {@link renderComponent}.
     */
    components: {}[];
}
export declare const MONKEY_PATCH_KEY_NAME = "__ngContext__";
export declare const HOST = 0;
export declare const TVIEW = 1;
export declare const FLAGS = 2;
export declare const PARENT = 3;
export declare const NEXT = 4;
export declare const CONTEXT = 9;
export declare const CHILD_HEAD = 14;
export declare const CHILD_TAIL = 15;
export declare const DECLARATION_VIEW = 17;
/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
/**
 * Below are constants for LContainer indices to help us look up LContainer members
 * without having to remember the specific indices.
 * Uglify will inline these when minifying so there shouldn't be a cost.
 */
export declare const ACTIVE_INDEX = 2;
export declare const NATIVE = 7;
export declare const VIEW_REFS = 8;
/**
 * Size of LContainer's header. Represents the index after which all views in the
 * container will be inserted. We need to keep a record of current views so we know
 * which views are already in the DOM (and don't need to be re-added) and so we can
 * remove views from the DOM when they are no longer required.
 */
export declare const CONTAINER_HEADER_OFFSET = 9;
export declare const HEADER_OFFSET = 20;
/**
 * Special location which allows easy identification of type. If we have an array which was
 * retrieved from the `LView` and that array has `true` at `TYPE` location, we know it is
 * `LContainer`.
 */
export declare const TYPE = 1;
export interface TView {
    template: Function | null;
    components: number[] | null;
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
    [HOST]: any;
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
}
export interface LContext {
    /**
     * The component's parent view data.
     */
    lView: LView;
}
/** Flags associated with an LView (saved in LView[FLAGS]) */
export declare const enum LViewFlags {
    /** The state of the init phase on the first 2 bits */
    InitPhaseStateIncrementer = 1,
    InitPhaseStateMask = 3,
    /**
     * Whether or not the view is in creationMode.
     *
     * This must be stored in the view rather than using `data` as a marker so that
     * we can properly support embedded views. Otherwise, when exiting a child view
     * back into the parent view, `data` will be defined and `creationMode` will be
     * improperly reported as false.
     */
    CreationMode = 4,
    /**
     * Whether or not this LView instance is on its first processing pass.
     *
     * An LView instance is considered to be on its "first pass" until it
     * has completed one creation mode run and one update mode run. At this
     * time, the flag is turned off.
     */
    FirstLViewPass = 8,
    /** Whether this view has default change detection strategy (checks always) or onPush */
    CheckAlways = 16,
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
    ManualOnPush = 32,
    /** Whether or not this view is currently dirty (needing check) */
    Dirty = 64,
    /** Whether or not this view is currently attached to change detection tree. */
    Attached = 128,
    /** Whether or not this view is destroyed. */
    Destroyed = 256,
    /** Whether or not this view is the root view */
    IsRoot = 512,
    /**
     * Index of the current init phase on last 22 bits
     */
    IndexWithinInitPhaseIncrementer = 1024,
    IndexWithinInitPhaseShift = 10,
    IndexWithinInitPhaseReset = 1023
}

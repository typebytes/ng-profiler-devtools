export declare const NG_DEVTOOLS_INIT = "NG_DEVTOOLS_INIT";
export declare const enum EventSource {
    CONTENT_SCRIPT = "ngProfilerDevtoolsContentScript",
    POPUP_SCRIPT = "ngProfilerDevtoolsPopupScript",
    INJECTED_SCRIPT = "ngProfilerDevtoolsInjectedScript"
}
export declare const enum PopupScriptEvents {
    IS_ANGULAR = "isAngularApp",
    TOGGLE_TRACING = "toggleTracing"
}
export declare const enum ContentScriptEvents {
    IS_ANGULAR = "isAngularApp",
    TOGGLE_TRACING = "toggleTracing"
}

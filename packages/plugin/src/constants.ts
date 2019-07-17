export const NG_DEVTOOLS_INIT = 'NG_DEVTOOLS_INIT';

export const enum EventSource {
	CONTENT_SCRIPT = 'ngProfilerDevtoolsContentScript',
	POPUP_SCRIPT = 'ngProfilerDevtoolsPopupScript',
	INJECTED_SCRIPT = 'ngProfilerDevtoolsInjectedScript',
}

export const enum PopupScriptEvents {
	IS_ANGULAR = 'isAngularApp',
	TOGGLE_TRACING = 'toggleTracing',
}

export const enum ContentScriptEvents {
	IS_ANGULAR = 'isAngularApp',
	TOGGLE_TRACING = 'toggleTracing',
}

import { ContentScriptEvents, EventSource } from '../constants';
import { promisePostMessage } from '../messaging/messaging';
import { injectScript } from './injection';
import { Message } from '../messaging/message-types';

const promisedPostMessage = promisePostMessage(EventSource.CONTENT_SCRIPT, EventSource.INJECTED_SCRIPT);

function onInjectedScriptLoaded() {
	chrome.storage.local.get('ngTraceEnabled', ({ngTraceEnabled}) => {
		promisedPostMessage.postMessage(ContentScriptEvents.TOGGLE_TRACING, {enabled: ngTraceEnabled});
	});
}

// Load the script and onLoad send the current tracing status
injectScript('ng-devtools.bundle.js', onInjectedScriptLoaded);
//
// // Messages from the popup script
// window.addEventListener('message', function (event: { source: any; data: any }) {
// 	console.log('received message in the content script', event);
// 	// Only accept messages from the same frame
// 	if (event.source !== window) {
// 		return;
// 	}
//
// 	const {data} = event;
// 	// Only accept messages that we know are ours
// 	if (
// 		typeof data !== 'object' ||
// 		data === null ||
// 		data.source !== EventSource.POPUP_SCRIPT
// 	) {
// 		return;
// 	}
//
//
// 	// Check if the event is supposed to be handled by the content script or not
// 	const {type, payload} = data;
// 	if (type === 'toggle') {
// 		console.log('toggle tracing', payload);
// 		// sendMessage(createTracingStatusEvent(payload));
// 		promisedPostMessage.postMessage(ContentScriptEvents.TOGGLE_TRACING, {enabled: payload});
// 		return;
// 	}
// });

// Messages from the injected script
window.addEventListener('ContentScriptEvent', function (event: any) {
	const {detail} = event;
	chrome.runtime.sendMessage({message: {...detail}});
});

// Listen for messages from the popup script and background page
chrome.runtime.onMessage.addListener(async function (request: Message, sender, sendResponse) {
	if (HANDLERS[request.action]) {
		// console.log('found handler', request.action);
		HANDLERS[request.action](request.payload);
		return;
	}

	window.postMessage(request, '*');
});

async function isAngularApp() {
	const sendToPopup = (isAngularApp) => {
		chrome.runtime.sendMessage({type: ContentScriptEvents.IS_ANGULAR, source: EventSource.CONTENT_SCRIPT, payload: isAngularApp});
	};
	const isAngular = await promisedPostMessage.postMessage(ContentScriptEvents.IS_ANGULAR, {});
	sendToPopup(isAngular);
}

function toggleTracing(tracingEnabled: boolean) {
	promisedPostMessage.postMessage(ContentScriptEvents.TOGGLE_TRACING, {enabled: tracingEnabled});
}

const HANDLERS = {
	isAngularApp: () => isAngularApp(),
	toggleTracing: (payload) => toggleTracing(payload),
};

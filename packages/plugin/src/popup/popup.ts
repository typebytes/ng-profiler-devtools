import { ContentScriptEvents, EventSource, PopupScriptEvents } from '../constants';
import { Message } from '../messaging/message-types';

function onDOMContentLoaded() {
	const traceSwitcherCbx = document.getElementById('traceSwitcherCbx');
	const errorElem = document.getElementById('error');
	const switcherElem = document.getElementById('switcher');

	chrome.storage.local.get('ngTraceEnabled', ({ngTraceEnabled}) => {
		(traceSwitcherCbx as HTMLInputElement).checked = !!ngTraceEnabled;
		switcherElem.scrollHeight;
		switcherElem.classList.add('loaded');
	});
	traceSwitcherCbx.addEventListener('change', e => {
		const enabled = (e.target as HTMLInputElement).checked;
		chrome.storage.local.set({ngTraceEnabled: enabled});
		chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
			const message: Message = {
				source: EventSource.POPUP_SCRIPT,
				action: PopupScriptEvents.TOGGLE_TRACING,
				payload: enabled
			};
			chrome.tabs.sendMessage(tabs[0].id, message);
			chrome.tabs.sendMessage(tabs[0].id, {...message, action: 'whut'});
		});
	});

	const message: Message = {
		source: EventSource.POPUP_SCRIPT,
		action: PopupScriptEvents.IS_ANGULAR
	};

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		try {
			chrome.tabs.sendMessage(
				tabs[0].id,
				message
			);
		} catch (e) {
			console.error('Plugin prolly disabled or something');
		}
	});

	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			if (request.source !== EventSource.CONTENT_SCRIPT) {
				return;
			}
			if (request.type === ContentScriptEvents.IS_ANGULAR) {
				if (!request.payload) {
					switcherElem.style.display = 'none';
					errorElem.innerHTML = `This page doesn't appear to be using Angular.`;
				}
			}
		}
	);
}

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

// <reference types="chrome"/>

import onConnect = chrome.runtime.onConnect;
import { NG_DEVTOOLS_INIT } from '../constants';

var connections = {};

onConnect.addListener(function(port) {
	var extensionListener = function(message, sender, sendResponse) {
		// The original connection event doesn't include the tab ID of the
		// DevTools page, so we need to send it explicitly.
		switch (message.type) {
			case NG_DEVTOOLS_INIT:
				// console.log('saving the tab id');
				connections[message.tabId] = port;
				break;
		}
	};

	// Listen to messages sent from the DevTools page
	port.onMessage.addListener(extensionListener as any);

	// When we disconnect, remove the tab id from our connections
	port.onDisconnect.addListener(function(port) {
		port.onMessage.removeListener(extensionListener as any);

		var tabs = Object.keys(connections);
		for (var i = 0, len = tabs.length; i < len; i++) {
			if (connections[tabs[i]] === port) {
				delete connections[tabs[i]];
				break;
			}
		}
	});
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// console.log('Received a message from the content script', request);
	// Messages from content scripts should have sender.tab set
	if (sender.tab) {
		sendMessage(sender.tab.id, request.message);
	} else {
		// console.log('Sender tab not defined');
	}
	return true;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	sendMessage(tabId, { name: 'RESET_DATA' });
});

const sendMessage = (tabId, request) => {
	if (tabId in connections) {
		connections[tabId].postMessage(request);
	} else {
		// console.log('Tab not found in the connection list');
	}
};

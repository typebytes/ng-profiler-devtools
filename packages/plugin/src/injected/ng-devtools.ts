import { isAngularApp, startTracing, stopTracing } from '../../../lib/src';
import { EventSource } from '../constants';
import { Message } from '../messaging/message-types';

function handleMessage(e: MessageEvent) {
	if (!e.data || !Array.isArray(e.data)) {
		return;
	}
	const [id, data] = e.data;

	if (!data || data.source !== EventSource.CONTENT_SCRIPT || !HANDLERS[data.action]) {
		return;
	}

	const result = HANDLERS[data.action](data.payload);

	const messageToSend: [number, Message] = [
		id,
		{
			source: EventSource.INJECTED_SCRIPT,
			action: data.action,
			payload: result
		}
	];
	postMessage(messageToSend, '*');
}

window.addEventListener('message', handleMessage);

const HANDLERS = {
	isAngularApp: () => isAngularApp(),
	toggleTracing: (status: { enabled: boolean }) => status.enabled ? startTracing() : stopTracing()
};

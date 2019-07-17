import { EventSource } from '../constants';
import { Message } from './message-types';

let uniqueId = 1;

export function promisePostMessage(fromEventSource: EventSource, toEventSource: EventSource) {
	const messageHandlers: {
		[key: string]: (result: any, error: any) => void;
	} = {};

	function onMessage(message: MessageEvent) {
		if (!Array.isArray(message.data)) {
			return;
		}
		const [messageId, result, error] = message.data;

		const handler = messageHandlers[messageId];

		if (!handler || !result || result.source !== toEventSource) {
			return;
		}

		handler(result.payload, error);
		delete messageHandlers[messageId];
	}

	window.addEventListener('message', onMessage);

	return {
		postMessage: (action: string, payload?: any): Promise<any> => {
			const id = uniqueId++;
			const messageToSend: [number, Message] = [
				id,
				{
					source: fromEventSource,
					action,
					payload: payload
				}
			];

			return new Promise((resolve, reject) => {
				messageHandlers[id] = (result, error) => {
					if (error) {
						reject(new Error(error));
					}

					resolve(result);
				};

				// // console.log('sending message', messageToSend);
				window.postMessage(messageToSend, '*');
			});
		}
	};
}

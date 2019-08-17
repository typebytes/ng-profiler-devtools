import { scheduleOutsideOfZone } from './zone-handler';

export function sendMessage(message) {
	scheduleOutsideOfZone(() => window.postMessage(
		{
			message: message,
			source: 'ngProfilerDevtoolsInjectedScript'
		},
		'*'
	));
}

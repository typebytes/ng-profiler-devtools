export function sendMessage(message) {
	window.postMessage(
		{
			message: message,
			source: 'ngProfilerDevtoolsInjectedScript'
		},
		'*'
	);
}

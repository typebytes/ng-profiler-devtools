let scriptInjection = new Set<string>();

const inject = (fn: (element: HTMLScriptElement) => void) => {
	const script = document.createElement('script');
	fn(script);
	document.documentElement.appendChild(script);
	script.parentNode.removeChild(script);
};

export const injectScript = (path: string, onLoadHandler?: () => void) => {
	if (scriptInjection.has(path)) {
		return;
	}

	inject(script => {
		script.src = chrome.extension.getURL(path);
		if (onLoadHandler) {
			script.onload = onLoadHandler;
		}
	});

	scriptInjection.add(path);
};

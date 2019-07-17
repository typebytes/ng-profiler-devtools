import { EventSource } from '../constants';
export declare function promisePostMessage(fromEventSource: EventSource, toEventSource: EventSource): {
    postMessage: (action: string, payload?: any) => Promise<any>;
};

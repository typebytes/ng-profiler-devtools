import { EventSource } from '../constants';
export interface Message {
    source: EventSource;
    action: string;
    payload?: any;
}

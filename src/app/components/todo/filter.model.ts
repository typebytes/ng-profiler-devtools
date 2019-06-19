import {Todo} from './todo.model';

export enum Filter {
	ALL = 'SHOW_ALL', ACTIVE = 'SHOW_ACTIVE', COMPLETED = 'SHOW_COMPLETED'
}

export class FilterUtil {
	static fromString(filter: string): Filter {
		switch (filter) {
			case 'completed':
				return Filter.COMPLETED;
			case 'active':
				return Filter.ACTIVE;
			case 'all':
			default:
				return Filter.ALL;
		}
	}

	static accepts(todo: Todo, filter?: Filter): boolean {
		switch (filter) {
			case Filter.ACTIVE:
				return !todo.completed;
			case Filter.COMPLETED:
				return todo.completed;
			case Filter.ALL:
			default:
				return true;
		}
	}
}

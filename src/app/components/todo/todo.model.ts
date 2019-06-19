export class Todo {
	id: number;
	title: string;
	completed: boolean;

	constructor(id: number, title: string, completed?: boolean) {
		this.id = id;
		this.title = title;
		this.completed = completed ? completed : false;
	}
}

export class TodoUtils {

	static copy(todo: Todo) {
		const copy = new Todo(null, null);
		this.copyProperties(todo, copy);
		return copy;
	}

	static copyProperties(src: Todo, dest: Todo) {
		dest.id = src.id;
		dest.title = src.title;
		dest.completed = src.completed;
	}
}

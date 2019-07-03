import { Injectable } from '@angular/core';

import { Todo } from './components/todo/todo.model';

@Injectable()
export class TodoService {
	private static STORAGE_KEY = 'todos-angular-5';
	private lastInsertId = 0;
	private todos: Todo[] = [];

	constructor() {
		this.fetch();
		if (this.todos.length > 0) {
			this.lastInsertId = this.todos[this.todos.length - 1].id;
		}
	}

	create(todo: string): Todo {
		todo = todo.trim();
		if (todo.length === 0) {
			return;
		}
		const newTodo = new Todo(++this.lastInsertId, todo);
		this.todos = [...this.todos, newTodo];
		this.save();
		return newTodo;
	}

	findAll() {
		return this.todos;
	}

	update(todoToUpdate: Todo) {
		this.save();
	}

	delete(todo: Todo) {
		this.todos = this.todos.filter(t => t !== todo);
		this.save();
	}

	toggle(todoToUpdate: Todo) {
		this.todos = this.todos.map(todo =>
			todo.id === todoToUpdate.id
				? { ...todo, completed: !todo.completed }
				: todo
		);
		this.save();
	}

	toggleAll(completed: boolean) {
		this.todos = this.todos.map(t => ({ ...t, completed }));
		this.save();
	}

	clearCompleted() {
		this.todos = this.todos.filter(t => !t.completed);
		this.save();
	}

	remaining() {
		return this.todos.filter(t => !t.completed).length;
	}

	completed() {
		return this.todos.filter(t => t.completed).length;
	}

	private fetch() {
		const persistedValue = localStorage.getItem(TodoService.STORAGE_KEY);
		try {
			this.todos = JSON.parse(persistedValue || '[]');
		} catch (ignore) {
			this.todos = [];
		}
	}

	private save(): void {
		localStorage.setItem(TodoService.STORAGE_KEY, JSON.stringify(this.todos));
	}
}

import {
	ChangeDetectionStrategy,
	Component,
	DoCheck,
	EventEmitter,
	Input,
	Output
} from '@angular/core';
import { Todo, TodoUtils } from '../todo/todo.model';

@Component({
	selector: 'app-todos-list',
	template: `
		<section *ngIf="todos.length > 0" class="main">
			<input
				class="toggle-all"
				id="toggle-all"
				type="checkbox"
				#inputToggleAll
				[checked]="allCompleted"
				(click)="toggleAll.emit()"
			/>
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
				<!--TODO: do something with filtered todos here-->
				<li
					*ngFor="let todo of todos"
					[ngClass]="{
						completed: todo.completed,
						editing: todo == currentTodo
					}"
				>
					<app-todo-item
						[todo]="todo"
						[currentTodo]="currentTodo"
						(edit)="edit($event)"
						(cancelEdit)="cancelEdit()"
						(delete)="delete.emit($event)"
						(toggle)="toggle.emit($event)"
						(update)="update.emit($event)"
					></app-todo-item>
				</li>
			</ul>
		</section>
	`,
	styleUrls: ['./todos-list.component.css']
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosListComponent implements DoCheck {
	@Input() todos: Todo[];
	@Output() toggleAll = new EventEmitter<boolean>();
	@Output() toggle = new EventEmitter<Todo>();
	@Output() update = new EventEmitter<Todo>();
	@Output() delete = new EventEmitter<Todo>();

	allCompleted = false;
	completed: number;
	remaining: number;

	currentTodo: Todo;
	snapshot: Todo;

	constructor() {}

	ngDoCheck() {
		this.remaining = this.completed = 0;
		this.allCompleted = this.todos.length === this.completed;
	}

	edit(todo: Todo) {
		this.currentTodo = todo;
		this.snapshot = TodoUtils.copy(todo);
	}

	cancelEdit() {
		TodoUtils.copyProperties(this.snapshot, this.currentTodo);
		this.currentTodo = null;
		this.snapshot = null;
	}
}

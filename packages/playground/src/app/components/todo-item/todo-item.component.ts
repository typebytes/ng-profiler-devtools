import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { Todo } from '../todo/todo.model';

@Component({
	selector: 'app-todo-item',
	template: `
		<div class="view">
			<input
				class="toggle"
				type="checkbox"
				(change)="toggle.emit(todo)"
				[checked]="todo.completed"
			/>
			<label *ngIf="currentTodo?.id != todo.id" (dblclick)="edit.emit(todo)">{{
				todo.title
			}}</label>
			<button (click)="delete.emit(todo)" class="destroy"></button>
		</div>
		<input
			*ngIf="currentTodo == todo"
			[(ngModel)]="currentTodo.title"
			(keyup.enter)="update.emit(currentTodo)"
			(keyup.esc)="cancelEdit.emit()"
			class="edit"
		/>
	`,
	styleUrls: ['./todo-item.component.css'],
	// changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
	@Input() todo: Todo;
	@Input() currentTodo: Todo;
	@Output() toggle = new EventEmitter<Todo>();
	@Output() edit = new EventEmitter<Todo>();
	@Output() delete = new EventEmitter<Todo>();
	@Output() update = new EventEmitter<Todo>();
	@Output() cancelEdit = new EventEmitter<Todo>();

	constructor() {}

	ngOnInit() {}
}

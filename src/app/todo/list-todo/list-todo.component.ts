import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TodoService} from '../../shared/services/todo.service';
import {Todo} from '../../shared/model/todo';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.css'],
})
export class ListTodoComponent implements OnInit {

	@Output() private toggleCompletion: EventEmitter<Todo>;

	public todos: Todo[];

	constructor(private todoService: TodoService) {
		this.toggleCompletion = new EventEmitter<Todo>();
	}
	ngOnInit() {
		this.todos = this.todoService.getTodos();
	}

	onToggleCompletion(index: number) {
		let todo = this.todos[index];
		this.toggleCompletion.emit(todo);
	}

	removeTodo(idx: number) {
		//this.todos.splice(idx,1);
		this.todoService.deleteTodo(idx);
		this.SQLSynchro();
	}

	SQLSynchro() {
		this.todoService.SQLSynchro();
		this.todos = this.todoService.getTodos();
	}
}

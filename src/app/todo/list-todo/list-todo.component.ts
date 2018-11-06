import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TodoService} from '../../shared/services/todo.service';
import {sqlList, SqlListService} from '../../shared/services/sql-list.service';
import {Todo} from '../../shared/model/todo';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.css'],
	providers: [
		SqlListService,
		TodoService
	],
})
export class ListTodoComponent implements OnInit {

	@Output() private toggleCompletion: EventEmitter<Todo>;

	public todos: Todo[];
//	public userList: sqlList[];

	constructor(private todoService: TodoService) {}
//	private todoService: TodoService, 
//	private sqlListService: SqlListService) {
//		this.toggleCompletion = new EventEmitter<Todo>();
//	}

	ngOnInit() {
		this.todoSynchro();
	}

	onToggleCompletion(index: number) {
		let todo = this.todos[index];
		this.toggleCompletion.emit(todo);
	}

	removeTodo(idx: number) {
		this.todoService.deleteTodo(idx);
		this.todoSynchro();
	}

	todoSynchro() {
		this.todoService.SQLSynchro();
		this.todos = this.todoService.getTodos();
	}
}

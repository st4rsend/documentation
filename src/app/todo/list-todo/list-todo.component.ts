import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TodoService} from '../../shared/services/todo.service';
import {sqlList, SqlListService} from '../../shared/services/sql-list.service';
import {Todo} from '../../shared/model/todo';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.css'],
})
export class ListTodoComponent implements OnInit {

	@Output() private toggleCompletion: EventEmitter<Todo>;

	public todos: Todo[];
	public userList: sqlList[];

	constructor(
	private todoService: TodoService, 
	private sqlListService: SqlListService) {
		this.toggleCompletion = new EventEmitter<Todo>();
	}
	ngOnInit() {
		this.todos = this.todoService.getTodos();
		this.userList = this.sqlListService.getUsers();
	}

	onToggleCompletion(index: number) {
		let todo = this.todos[index];
		this.toggleCompletion.emit(todo);
	}

	removeTodo(idx: number) {
		//this.todos.splice(idx,1);
		this.todoService.deleteTodo(idx);
		this.todoSynchro();
	}

	todoSynchro() {
		//console.log("User list:", this.userList);
		this.todoService.SQLSynchro();
		this.todos = this.todoService.getTodos();
		console.log (this.todos);
	}
	userSynchro() {
		this.sqlListService.SQLSynchro();
		this.userList = this.sqlListService.getUsers();
		console.log (this.userList);
	}
	allSynchro() {
		this.todoService.SQLSynchro();
		this.sqlListService.SQLSynchro();
		this.todos = this.todoService.getTodos();
		this.userList = this.sqlListService.getUsers();
		console.log (this.userList);
	}
}

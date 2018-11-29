import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TodoService} from '../../shared/services/todo.service';
import {sqlList, SqlListService} from '../../shared/services/sql-list.service';
import {Todo} from '../../shared/model/todo';

@Component({
  selector: 'app-list-todo',
  templateUrl: './list-todo.component.html',
  styleUrls: ['./list-todo.component.scss'],
	providers: [
		SqlListService,
	],
})
export class ListTodoComponent implements OnInit {

	@Output() private toggleCompletion: EventEmitter<Todo>;
	@Output() updateRequest = new EventEmitter<number>();

	public todos: Array<Todo>;
//	public userList: sqlList[];

	constructor(private todoService: TodoService) {}

	ngOnInit() {
		this.todoSynchro();
	}

	onToggleCompletion(index: number) {
		console.log(this.todoService.getTodo(index));
		//this.toggleCompletion.emit(todo);
	}

	removeTodo(idx: number) {
		this.todoService.deleteTodo(idx);
		this.todoSynchro();
	}

	updateTodo(idx: number) {
		this.updateRequest.emit(idx);
	}

	todoSynchro() {
		this.todoService.SQLSynchro();
		this.todos = this.todoService.getTodos();
	}
}

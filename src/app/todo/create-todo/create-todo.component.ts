import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../shared/services/todo.service';
import { SqlListService, sqlList } from '../../shared/services/sql-list.service';
import { Todo } from '../../shared/model/todo';

import { WebSocketService } from '../../shared/services/websocket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css'],
	providers: [ TodoService, SqlListService ],
})
export class CreateTodoComponent implements OnInit {

	public todo: Todo;
	private userList: sqlList[]=[];
	private isConnected: boolean = false;
	private isConnectedSub: Subscription;

  constructor( 
		private todoService: TodoService, 
		private userListService: SqlListService,
		private webSocket: WebSocketService ) { 

		this.todo = new Todo(null,null,'label',null,null,false);
		
	}

  ngOnInit() {
		this.userList = this.userListService.getUsers();
  }

	@Input() inputPlaceholder: string;
	@Input() buttonLabel: string;

	@Output() createTodo = new EventEmitter<Todo>();

	emitTodo(todo: Todo) {
//		this.createTodo.emit(todo);
		this.todoService.createTodo(todo);
	}
}

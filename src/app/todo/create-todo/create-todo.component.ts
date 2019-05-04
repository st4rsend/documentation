import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../shared/services/todo.service';
import { SqlListService, SqlList } from '../../shared/services/sql-list.service';
import { Todo } from '../../shared/model/todo';

import { WebSocketService } from '../../shared/services/websocket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css'],
	providers: [ SqlListService ],
})
export class CreateTodoComponent implements OnInit {

	@Input() channelID: number;

	public todo: Todo;
	public confirmed: boolean = false;
	public userList: SqlList[]=[];
	private isConnected: boolean = false;
	private isConnectedSub: Subscription;

  constructor( 
		private todoService: TodoService, 
		private userListService: SqlListService,
		private webSocket: WebSocketService ) { 
			this.todo = new Todo(null,null,null,'label',null,null,false);
	}

  ngOnInit() {
		this.todoService.setChannelID(this.channelID);
		this.userList = this.userListService.getList("users","ID","identity");
  }

	createTodo(todo: Todo) {
		this.todoService.createTodo(todo);
	}
}

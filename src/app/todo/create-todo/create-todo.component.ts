import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../shared/services/todo.service';
import { SqlListService, ISqlList } from '../../shared/services/sql-list.service';
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
	public userList: Array<ISqlList> = [];
	//public userList: SqlList[]=[];
	private isConnected: boolean = false;
	private isConnectedSub: Subscription;

  constructor( 
		private todoService: TodoService, 
		private userListService: SqlListService,
	) { 
			this.todo = new Todo(null,null,null,'label',null,null,false);
	}

  ngOnInit() {
		this.todoService.setChannelID(this.channelID);
		this.userListService.InitList("users","ID","identity");
		this.userList = this.userListService.GetList();
  }

	createTodo(todo: Todo) {
		this.todoService.createTodo(todo);
	}
}

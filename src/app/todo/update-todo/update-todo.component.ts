import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';


import { TodoService } from '../../shared/services/todo.service';
import { SqlListService, sqlList } from '../../shared/services/sql-list.service';
import { Todo } from '../../shared/model/todo';

import { WebSocketService } from '../../shared/services/websocket.service';

@Component({
  selector: 'app-update-todo',
  templateUrl: './update-todo.component.html',
  styleUrls: ['./update-todo.component.css'],
	providers: [ TodoService, SqlListService ],
})
export class UpdateTodoComponent implements OnInit {

	public todo: Todo;
	private userList: sqlList[]=[];

	public IDControl = new FormControl();

  constructor(
		private todoService: TodoService, 
		private userListService: SqlListService,
		private webSocket: WebSocketService 
	) { 
	this.todo = new Todo(null,null,'label',null,null,false);
	}


  ngOnInit() {
		this.userList = this.userListService.getUsers();
  }

	emitTodo(todo: Todo) {
		//this.todoService.updateTodo(todo);
	}

}

import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { Todo } from '../model/todo';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()

export class TodoService {

	private todos: Array<Todo>;

	private tsSelectSQL: any = 'select T.ID, identity, U.ID, task, status, date_format(targetDate, "%d/%m/%Y"), date_format(doneDate,"%d/%m/%Y") from todos T left join users U on T.userID = U.ID';
	private tsInsertSQL: string = 'insert into todos (UserID, task, status, targetDate, doneDate) values(';
	private tsDeleteSQL: string = 'delete from todos where ID=';
	private tsSelectSub: Subscription;
	private tsSubject: Subject<any>;

	constructor ( private webSocketService: WebSocketService ) {
		console.log("Constructor TodoService");
		this.todos = [];
	}

	public getTodo(idx: number): Todo {
		return this.todos.find(k => k.idx === idx);
		
	}

	//public getTodos() : Todo[] {
	public getTodos() : Array<Todo> {
		return this.todos;
	}

	public createTodo(todo: Todo) {
		console.log("Creating todo: ", todo);
		var sql = this.tsInsertSQL.concat(
			todo.user,',"',
			todo.label,'",false,"',
			todo.targetDate,'","',
			todo.doneDate,'")');
		console.log("SQL: ", sql);

		this.tsSubject = this.webSocketService.wsSubject();

		let message1 = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_INSERT',[sql]);
		this.tsSubject.next(message1);
	}

	public deleteTodo(idx: number) {
		console.log("Deleting todo: ", idx);
		var sql = this.tsDeleteSQL.concat(String(idx));

		this.tsSubject = this.webSocketService.wsSubject();

		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});

		let message1 = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_DELETE',[sql]);
		this.tsSubject.next(message1);
	}

	public SQLSynchro() {

		//this.todos = [];
		this.tsSubject = this.webSocketService.wsSubject();

		if ((this.tsSelectSub === undefined) || (this.tsSelectSub.closed === true)) {
			this.tsSelectSub = this.tsSubject.subscribe((value) => { this.tsParse(value); });
		}

		let message = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_SELECT',[this.tsSelectSQL]);
		this.tsSubject.next(message);
	}

	private tsParse(scMsg: wsMessage) {
		var todo: Todo;
		if ((+scMsg.payload.channelid === 0) && (scMsg.payload.domain === "SQL")) {
			if (scMsg.payload.command === "RESP_SELECT_DATA") {
				if (+scMsg.payload.data[4] > 0) {
					this.todos.push(new Todo(
						+scMsg.payload.data[0],
						scMsg.payload.data[1],
						scMsg.payload.data[3],
						scMsg.payload.data[5],
						scMsg.payload.data[6],
						true
					));
				} else {
					this.todos.push(new Todo(
						+scMsg.payload.data[0],
						scMsg.payload.data[1],
						scMsg.payload.data[3],
						scMsg.payload.data[5],
						scMsg.payload.data[6],
						false
					));
				}
			}
			if ((+scMsg.payload.channelid === 0) && (scMsg.payload.command === "EOF")) {
				console.log('EOF');
				this.tsSelectSub.unsubscribe();
			}
		}
	}
}


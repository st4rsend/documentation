import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Todo } from '../model/todo';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()

export class TodoService {

	private todos: Todo[];

	private tsSelectSQL: any = 'select T.ID, identity, U.ID, task, status, date_format(targetDate, "%d/%m/%Y"), date_format(doneDate,"%d/%m/%Y") from todos T left join users U on T.userID = U.ID';
	private tsInsertSQL: string = 'insert into todos (UserID, task, status, targetDate, doneDate) values(';
	private tsDeleteSQL: string = 'delete from todos where ID=';
	private tsSelectSub: Subscription;
	private tsSubject: Subject<any>;

	constructor ( private webSocketService: WebSocketService ) {
	}

	public getTodos() : Todo[] {
		return this.todos;
	}

	public addTodo(todo: Todo) {
		this.todos.push(todo);
	}

	public createTodo(todo: Todo) {
		console.log("Creating todo: ", todo);
		var sql = this.tsInsertSQL.concat(
			todo.user,',"',
			todo.label,'",false,"',
			todo.targetDate,'","',
			todo.doneDate,'")');
		console.log("SQL: ", sql);

		this.tsSubject = <Subject<any>>this.webSocketService
		.wsCreateSubject()
		.map((tsResponse: MessageEvent): any => {
			return this.tsParse(tsResponse);
		});

		this.tsSelectSub = this.tsSubject.subscribe({
			next(x) { },}
		);

		let message1 = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_INSERT',[sql]);
		this.tsSubject.next(message1);
	}

	public deleteTodo(idx: number) {
		console.log("Deleting todo: ", idx);
		var sql = this.tsDeleteSQL.concat(String(idx));
		console.log("SQL: ", sql);

		this.tsSubject = <Subject<any>>this.webSocketService
		.wsCreateSubject()
		.map((tsResponse: MessageEvent): any => {
			return this.tsParse(tsResponse);
		});

		this.tsSelectSub = this.tsSubject.subscribe({
			next(x) { },}
		);

		let message1 = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_DELETE',[sql]);
		this.tsSubject.next(message1);
	}

	public SQLSynchro() {

		this.todos = [];
		this.tsSubject = <Subject<any>>this.webSocketService
		.wsCreateSubject()
		.map((tsResponse: MessageEvent): any => {
			return this.tsParse(tsResponse);
		});

		this.tsSelectSub = this.tsSubject.subscribe({
			next(x) {},
		});
		let message1 = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_SELECT',[this.tsSelectSQL]);
		this.tsSubject.next(message1);
	}

	private tsParse(scMsgEvent: MessageEvent): MessageEvent {
		let scMsg: wsMessage;
		try {
			scMsg = JSON.parse(scMsgEvent.data);
		}
		catch(e){
			console.log("SCERROR: PARSE: Couldn't parse as JSON from websocket");
			return scMsgEvent;
		}
		if (scMsg.payload.domain === "SQL") {
			if (scMsg.payload.command === "RESP_SELECT_DATA") {
				if (+scMsg.payload.data[4] > 0) {
					this.addTodo(new Todo(
						+scMsg.payload.data[0],
						scMsg.payload.data[1],
						scMsg.payload.data[3],
						scMsg.payload.data[5],
						scMsg.payload.data[6],
						true
					));
				} else {
					this.addTodo(new Todo(
						+scMsg.payload.data[0],
						scMsg.payload.data[1],
						scMsg.payload.data[3],
						scMsg.payload.data[5],
						scMsg.payload.data[6],
						false
					));
				}
				console.log('TODO LIST');
			}
			if (scMsg.payload.command === "EOF") {
				console.log('EOF');
			}
		}
		//console.log(scMsgEvent);
		return scMsgEvent;
	}
}

import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { Todo } from '../model/todo';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()

export class TodoService {

	private todos: Array<Todo>;

	private tsSelectSQL: any = 'select T.ID, U.ID, identity, task, status, date_format(targetDate, "%Y-%m-%d"), date_format(doneDate,"%Y-%m-%d") from todos T left join users U on T.userID = U.ID';
	private tsInsertSQL: string = 'insert into todos (UserID, task, status, targetDate, doneDate) values(';
	private tsDeleteSQL: string = 'delete from todos where ID=';
	private tsUpdateSQL: string = 'update todos set ';
	private tsSelectSub: Subscription;
	private tsSubject: Subject<any>;
	public channelID: number = 1;

	public isReady$ = new Subject<any>();

	constructor ( private webSocketService: WebSocketService ) {
		this.todos = [];
	}

	public setChannelID(channelID: number){
		this.channelID = channelID;
	}

	public getTodo(idx: number): Todo {
		return this.todos.find(k => k.idx === idx);
	}

	public getTodos() : Array<Todo> {
		return this.todos;
	}

	public createTodo(todo: Todo) {
		//console.log("Creating todo: ", todo);
		this.isReady$.next(false);
		var sql = this.tsInsertSQL.concat(
			String(todo.userID),',"',
			todo.label,'",false,"',
			todo.targetDate,'","',
			todo.doneDate,'")');
		this.tsSubject = this.webSocketService.wsSubject();
		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});

		let message1 = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','REQ_INSERT',[sql]);
		this.tsSubject.next(message1);
	}

	public deleteTodo(idx: number) {
		//console.log("Deleting todo: ", idx);
		this.isReady$.next(false);
		var sql = this.tsDeleteSQL.concat(String(idx));

		this.tsSubject = this.webSocketService.wsSubject();

		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});

		let message1 = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','REQ_DELETE',[sql]);
		this.tsSubject.next(message1);
	}

	public updateTodo(todo: Todo) {
		//console.log("updating todo: ", todo);
		this.isReady$.next(false);
		var sql = this.tsUpdateSQL.concat(
			'userID=',String(todo.userID),', ',
			'task="',todo.label,'", ',
			'targetDate="',todo.targetDate,'", ',
			'doneDate="',todo.doneDate,'", ',
			'status=',String(todo.completed),
			' WHERE ID=',String(todo.idx));
		this.tsSubject = this.webSocketService.wsSubject();
		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});
		let message1 = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','REQ_UPDATE',[sql]);
		this.tsSubject.next(message1);

	}

	public SQLSynchro() {

		this.isReady$.next(false);
		this.todos = [];

		this.tsSubject = this.webSocketService.wsSubject();

		if ((this.tsSelectSub === undefined) || (this.tsSelectSub.closed === true)) {
			this.tsSelectSub = this.tsSubject.subscribe((value) => { this.tsParse(value); });
		}

		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','REQ_SELECT',[this.tsSelectSQL]);
		this.tsSubject.next(message);
		this.tsSubject.next(message);
	}

	private tsParse(scMsg: wsMessage) {
		var todo: Todo;
		if ((+scMsg.payload.channelid === this.channelID) && (scMsg.payload.domain === "SQL")) {
			if (scMsg.payload.command === "RESP_SELECT_DATA") {
				if (+scMsg.payload.data[4] > 0) {
					this.todos.push(new Todo(
						+scMsg.payload.data[0],
						+scMsg.payload.data[1],
						scMsg.payload.data[2],
						scMsg.payload.data[3],
						scMsg.payload.data[5],
						scMsg.payload.data[6],
						true
					));
				} else {
					this.todos.push(new Todo(
						+scMsg.payload.data[0],
						+scMsg.payload.data[1],
						scMsg.payload.data[2],
						scMsg.payload.data[3],
						scMsg.payload.data[5],
						scMsg.payload.data[6],
						false
					));
				}
			}
			if ((+scMsg.payload.channelid === this.channelID) && (scMsg.payload.command === "EOF")) {
				console.log('EOF');
				this.isReady$.next(true);
				this.tsSelectSub.unsubscribe();
			}
		}
	}
}


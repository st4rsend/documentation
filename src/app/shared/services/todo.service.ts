import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { Todo } from '../model/todo';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()

export class TodoService {

	private todos: Array<Todo>;

	private tsSelectSub: Subscription;
	private tsSubject: Subject<any>;
	public channelID: number = 1;
	public baseChannelID: number = 64;

	public isReady$ = new Subject<any>();

	constructor ( private webSocketService: WebSocketService ) {
		this.todos = [];
	}

	public setChannelID(channelID: number){
		this.channelID = this.baseChannelID + channelID;
	}

	public getTodo(idx: number): Todo {
		return this.todos.find(k => k.idx === idx);
	}

	public getTodos() : Array<Todo> {
		return this.todos;
	}

	public createTodo(todo: Todo) {
		this.isReady$.next(false);
		this.tsSubject = this.webSocketService.wsSubject();
		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});

		let message1 = this.webSocketService
			.wsPrepareMessage(this.channelID,'TODO','INSERT_TODO',[
				todo.userID.toString(),
				todo.label,
				todo.completed.toString(),
				todo.targetDate,
				todo.doneDate]);
		this.tsSubject.next(message1);
	}

	public deleteTodo(idx: number) {
		this.isReady$.next(false);
		this.tsSubject = this.webSocketService.wsSubject();
		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});
		let message1 = this.webSocketService
			.wsPrepareMessage(this.channelID,'TODO','DELETE_TODO',[idx.toString()]);
		this.tsSubject.next(message1);
	}

	public updateTodo(todo: Todo) {
		this.isReady$.next(false);
		this.tsSubject = this.webSocketService.wsSubject();
		this.tsSelectSub = this.tsSubject.subscribe((value) => {
			this.tsParse(value);
		});
		let message1 = this.webSocketService
			.wsPrepareMessage(this.channelID,'TODO','UPDATE_TODO',[
				todo.userID.toString(),
				todo.label,
				todo.targetDate,
				todo.doneDate,
				todo.completed.toString(),
				todo.idx.toString()]);
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
			.wsPrepareMessage(this.channelID,'TODO','GET_TODOS',[]);
		this.tsSubject.next(message);
	}

/*
	public getTodoUsers() {
		this.isReady$.next(false);
		this.users = [];
		

		this.isReady$.next(true);
}
*/
	private tsParse(scMsg: wsMessage) {
		var todo: Todo;
		if ((+scMsg.payload.channelid === this.channelID) && (scMsg.payload.domain === "TODO")) {
			if (scMsg.payload.command === "RESP_TODOS") {
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


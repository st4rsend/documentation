import { Component, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { WebSocketService, wsMessage } from './shared/services/websocket.service';

import { Todo } from './todo-list/todo-list.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'St4rsend';
  todos: Todo[] = [{
    label: 'Buy milk',
    completed: false
  }, {
    label: 'Save the world',
    completed: true
  }];
  name: string = 'John';
	
	addTodo(label: string) {
		this.todos.push({
			label,
			completed: false
		});
	}
	
	connected: Subscription;
	isConnected = false;

	address: any = 'wss://dev.st4rsend.net/ws';
	//message: any = 'SELECT id,task,status FROM todolist';
	message: any = 'select T.ID, identity, U.ID, task, status from todos T left join users U on T.userID = U.ID';
	messages: Subject<any>;
	messageLog: any;

	scrollEndNow = false;

	@ViewChild('console') console: ElementRef;

	constructor(private _websocket: WebSocketService) {
		this.connected = _websocket.connected().subscribe(status => {
			this.isConnected = status;
			console.log('status', status);
			// this._changeDetectorRef.detectChanges()
		});
	}

	connect() {
		this.messages = <Subject<any>>this._websocket
			.connect(this.address)
			.map((response: MessageEvent): any => {
				console.log(response);
				return response.data;
			});

		console.log(this._websocket);


		this.messageLog = this.messages.scan((current, change) => {
			this.scrollEnd();
			let msg: wsMessage = JSON.parse(change);
			if (msg.payload.domain === "SQL") {
				if (msg.payload.command === "RESP_SELECT_HEADER") {
					return [...current, `HEADERS: ${JSON.stringify(msg.payload.data)}`]
				}
				if (msg.payload.command === "RESP_SELECT_DATA") {
					if (+msg.payload.data[3] > 0) {
						this.todos.push({
							label: msg.payload.data[1],
							completed: true
						});
					} else {
						this.addTodo(msg.payload.data[1])
					}
					return [...current, `DATA: UID: ${msg.payload.data[0]} ; owner: ${msg.payload.data[1]} ; OID: ${msg.payload.data[2]} ; task: ${msg.payload.data[3]} ; status  ${msg.payload.data[4]}`]
				}	
				if (msg.payload.command === "EOF") {
					return [...current, `EOF`]
				}
			}
			let msgStr = JSON.stringify(msg.payload);
				//return [...current, `REPONSE: ${change}`]
			return [...current, `REPONSE: ${msgStr}`]
		}, []);
    // this.messages.next(`CONNECT: ${this.address}`);
	}

	send() {
		console.log('this.messageLog', this.messageLog);
		//this.messageLog = [...this.messageLog, 'SENT: ' + this.message];
		this.messages.next(this.message);
	}

	onMessageKeyup(event) {
		if (event.keyCode === 13) {
			this.send();
		}
		console.log(event);
	}

	scrollEnd() {
		setTimeout( () => {
			this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
		}, 100);
	}
}

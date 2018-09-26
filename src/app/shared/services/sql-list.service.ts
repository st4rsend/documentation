import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketService, wsMessage } from './websocket.service';

export interface sqlList {
	id: number;
	value: string;
}

@Injectable(
/*
{
  providedIn: 'root'
}
*/
)

export class SqlListService {

	private users:sqlList[];

	private selectSQL: string = 'select ID,identity from users';

	private selectSub: Subscription;
	private subject: Subject<any>;

  constructor(private webSocketService: WebSocketService) { }


	public getUsers(): sqlList[] {
		return this.users;
	}

	public SQLSynchro(){
		this.users  = [];
/*
		this.users  = [
			{id: null, value: 'Global'},
			{id: 1, value: 'User 1'},
			{id: 3,value:'User 3'},
		];
*/
		this.subject = <Subject<any>>this.webSocketService
			.wsCreateSubject()
			.map((response: MessageEvent): any => {
				return this.parse(response);
		});
		this.selectSub = this.subject.subscribe({
			next(x) {},
		});
		let message = this.webSocketService
			.wsPrepareMessage(0,'SQL','REQ_SELECT',[this.selectSQL]);
		this.subject.next(message);
		console.log("Users: ", this.users);
//		return this.users;
	}

	public parse (msgEvent: MessageEvent) {
		let msg: wsMessage;
		try {
			msg = JSON.parse(msgEvent.data);
		}
		catch(e) {
			console.log("SQL-LIST: PARSE: Couldn't parse as JSON from websocket", msgEvent);
		}
		if (msg.payload.domain === "SQL") {
			if (msg.payload.command === "RESP_SELECT_DATA") {
				this.users.push({id: +msg.payload.data[0], value: msg.payload.data[1]});
				console.log("USER LIST");
			}
			if (msg.payload.command === "EOF") {
				console.log('SQL-LIST: EOF');
			}
		}
		return msgEvent;
	}
}

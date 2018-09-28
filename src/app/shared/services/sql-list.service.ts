import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketService, wsMessage } from './websocket.service';

export interface sqlList {
	id: number;
	value: string;
}

@Injectable(
)

export class SqlListService {

	private users:sqlList[];

	private selectSQL: string = 'select ID,identity from users';

	private selectSub: Subscription;
	private subject: Subject<any>;

  constructor(private webSocketService: WebSocketService) { }


	public getUsers(): sqlList[] {
		this.SQLSynchro();
		return this.users;
	}

	public SQLSynchro(){
		this.users  = [];
		this.subject = this.webSocketService.wsSubject();

		if ((this.selectSub === undefined) || (this.selectSub.closed === true)) {
			this.selectSub = this.subject.subscribe((value) => { this.parse(value); });
		}
		let message = this.webSocketService
			.wsPrepareMessage(1,'SQL','REQ_SELECT',[this.selectSQL]);
		this.subject.next(message);
	}

	public parse (msg: wsMessage) {
		if ( (+msg.payload.channelid === 1) && (msg.payload.domain === "SQL")) {
			if (msg.payload.command === "RESP_SELECT_DATA") {
				this.users.push({id: +msg.payload.data[0], value: msg.payload.data[1]});
			}
			if ((+msg.payload.channelid === 1) && ( msg.payload.command === "EOF")) {
				console.log('SQL-LIST: EOF');
				this.selectSub.unsubscribe();
			}
		}
	}
}

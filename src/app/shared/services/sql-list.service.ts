import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';

export interface SqlList {
	id: number;
	value: string;
}

@Injectable(
)

export class SqlListService {

	private sqlList: SqlList[];

	private selectSub: Subscription;
	private subject: Subject<any>;

  constructor(private webSocketService: WebSocketService) { }


	public getList(table: string, id: string, column: string): SqlList[] {
		this.SQLGetList(table, id, column);
		return this.sqlList;
	}

	public SQLGetList(table: string, id: string, column: string){
		this.sqlList  = [];
		this.subject = this.webSocketService.wsSubject();

		if ((this.selectSub === undefined) || (this.selectSub.closed === true)) {
			this.selectSub = this.subject.subscribe((value) => { this.parse(value); });
		}
		let message = this.webSocketService
			.wsPrepareMessage(1,'SQL','GET_LIST',[table, id, column] );
		this.subject.next(message);
	}

	public parse (msg: wsMessage) {
		if ( (+msg.payload.channelid === 1) && (msg.payload.domain === "SQL")) {
			if (msg.payload.command === "RESP_SQL_LIST") {
				this.sqlList.push({id: +msg.payload.data[0], value: msg.payload.data[1]});
			}
			if ((+msg.payload.channelid === 1) && ( msg.payload.command === "EOF")) {
				console.log('SQL-LIST: EOF');
				this.selectSub.unsubscribe();
			}
		}
	}
}

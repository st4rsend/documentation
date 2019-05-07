import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';

export interface ISqlList {
	id: number;
	value: string;
}

@Injectable(
)

export class SqlListService {

	private sqlList: Array<ISqlList>;

	private selectSub: Subscription;
	private subject: Subject<any>;

  constructor(private webSocketService: WebSocketService) { 
		console.log("Contructing SqlListService");
	}


	public GetList(): Array<ISqlList> {
		return this.sqlList;
	}

	public InitList(table: string, id: string, column: string){
		this.sqlList  = [];
		this.subject = this.webSocketService.wsSubject();

		if ((this.selectSub === undefined) || (this.selectSub.closed === true)) {
			this.selectSub = this.subject.subscribe((value) => { this.parse(value); });
		}
		let message = this.webSocketService
			.wsPrepareMessage(1,'SQL','GET_LIST',[table, id, column] );
		this.subject.next(message);
	}

	private parse (msg: wsMessage) {
		if ( (+msg.payload.channelid === 1) && (msg.payload.domain === "SQL")) {
			if (msg.payload.command === "RESP_SQL_LIST") {
				this.sqlList.push({id: +msg.payload.data[0], value: msg.payload.data[1]});
			}
			if ((+msg.payload.channelid === 1) && ( msg.payload.command === "EOF")) {
				this.selectSub.unsubscribe();
			}
		}
	}
}

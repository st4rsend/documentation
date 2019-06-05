import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { GlobalService } from './global.service';

export interface ISqlList {
	idx: number;
	value: string;
	position: number;
}

@Injectable(
)

export class SqlListService {

	sqlList: Array<ISqlList>;

	selectSub: Subscription;
	subject: Subject<any>;

	isReady$ = new Subject<boolean>();

	channelID: number;

	table_name: string;
	idx_name: string;
	column_name: string;
	position_name: string;

  constructor(
		private webSocketService: WebSocketService,
		private globalService: GlobalService) { 
		this.channelID = this.globalService.GetSqlListChannel();
	}


	public GetList(): Array<ISqlList> {
		return this.sqlList as Array<ISqlList>;
	}

	public UpdateList(newList: Array<ISqlList>) {
// TODO Handle correctly things
		// Add or update members
		for ( let item in newList ) {
			if ( newList[item].idx == 0 ) {
				// added item
				newList[item].position = +item + 1;
				this.InsertItem(newList[item]);
				continue;
			}
			if ((newList[item].idx != this.sqlList[item].idx) 
			|| (newList[item].value != this.sqlList[item].value)) {
				newList[item].position = +item + 1;
				this.UpdateItem(newList[item]);
				continue;
			}
		}
	}

	public InitList(table: string, idx: string, column: string, position: string){
		this.table_name = table;
		this.idx_name = idx;
		this.column_name = column;
		this.position_name = position;
		this.isReady$.next(false);
		this.sqlList  = [];
		this.subject = this.webSocketService.wsSubject();

		if ((this.selectSub === undefined) || (this.selectSub.closed === true)) {
			this.selectSub = this.subject.subscribe((value) => {
				this.parse(value);
			 });
		}
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','GET_LIST',[this.table_name, this.idx_name, this.column_name, this.position_name] );
		this.subject.next(message);
	}

	public UpdateItem(item: ISqlList) {
		this.subject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','UPDATE_LIST',[
				this.table_name,
				this.idx_name,
				this.column_name,
				this.position_name,
				item.idx.toString(),
				item.value,
				item.position.toString()
			]);
		this.subject.next(message);
	}

	public InsertItem(item: ISqlList) {
		this.subject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','INSERT_LIST',[
				this.table_name,
				this.column_name,
				this.position_name,
				item.value,
				item.position.toString()
			]);
		this.subject.next(message);
	}

	public DeleteItem(idx: number) {
		this.subject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'SQL','DELETE_LIST',[
				this.table_name,
				this.idx_name,
				idx.toString(),
			]);
		this.subject.next(message);
	}

	private parse (msg: wsMessage) {
		if ( (+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SQL")) {
			if (msg.payload.command === "RESP_SQL_LIST") {
				this.sqlList.push({
					idx: +msg.payload.data[0], 
					value: msg.payload.data[1],
					position: +msg.payload.data[2],
				});
			}
			if ((+msg.payload.channelid === this.channelID) && ( msg.payload.command === "EOF")) {
				this.isReady$.next(true);
				this.selectSub.unsubscribe();
			}
		}
	}
}

import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { GlobalService } from './global.service';

export interface ISqlList {
	idx: number;
	value: string;
	position: number;
	humanRating: number;
	calcRating: number;
}

interface ISqlListDef {
	table_name: string;
	idx_name: string;
	column_name: string;
	position_name: string;
	asFilter: boolean;
	filter_column_name: string;
	filter_value: string;
	humanRating_value: number;
	calcRating_value: number;
}
	
interface IList {
	channelID: number;
	selectSub: Subscription;
	sqlListDef: ISqlListDef;
	sqlList: Array<ISqlList>;
	sqlMap: Map<number, string>;
}

@Injectable(
)

export class SqlListService {

	listMap: Map<string, IList>;
	subject: Subject<any>;
	isReady$ = new Subject<boolean>();

  constructor(
		private webSocketService: WebSocketService,
		private globalService: GlobalService) { 
	//	this.RemoveFilter;
		this.listMap = new Map();
	}


	public GetList(): Array<ISqlList> {
		return this.listMap.get("default").sqlList as Array<ISqlList>;
	}
	public GetListKey(key: string): Array<ISqlList> {
		return this.listMap.get(key).sqlList as Array<ISqlList>;
	}

	public GetMap(): Map<number, string> {
		return this.listMap.get("default").sqlMap as Map<number, string>;
	}

	public GetMapKey(key: string): Map<number, string> {
		return this.listMap.get(key).sqlMap as Map<number, string>;
	}

	public SetFilterKey(key: string, column: string, value: string){
		this.listMap.get(key).sqlListDef.filter_column_name = column;
		this.listMap.get(key).sqlListDef.filter_value = value;
		this.listMap.get(key).sqlListDef.asFilter = true;
		this.sqlGetList(key);
	}
	public RemoveFilterKey(key: string){
		this.listMap.get(key).sqlListDef.filter_column_name = "";
		this.listMap.get(key).sqlListDef.filter_value = "";
		this.listMap.get(key).sqlListDef.asFilter = false;
		this.sqlGetList(key);
	}

	public SetFilter(column: string, value: string){
		this.SetFilterKey("default", column, value);
	}
	public RemoveFilter(){
		this.RemoveFilterKey("default");
	}

	public setDepth(value: number) {
		this.SetDepthKey("default", value);
	}

	public SetDepthKey(key: string, value: number) {
		this.listMap.get(key).sqlListDef.humanRating_value = value;
		this.sqlGetList(key);
	}

	public UpdateListKey(key: string, newList: Array<ISqlList>) {
// TODO Handle correctly things
		// Add or update members
		for ( let item in newList ) {
			if ( newList[item].idx == 0 ) {
				// added item
				newList[item].position = +item + 1;
				this.InsertItemKey(key, newList[item]);
				continue;
			}
			if ((newList[item].idx != this.listMap.get(key).sqlList[item].idx) 
			|| (newList[item].value != this.listMap.get(key).sqlList[item].value)
			|| (newList[item].humanRating != this.listMap.get(key).sqlList[item].humanRating)) {
				newList[item].position = +item + 1;
				this.UpdateItemKey(key, newList[item]);
				continue;
			}
		}
	}
	public UpdateList(newList: Array<ISqlList>) {
		this.UpdateListKey("default", newList);
	}

	public InitList(table: string, idx: string, column: string, position: string) {
		this.InitListKey("default", table, idx, column, position);
	}

	public InitListKey(key: string, table: string, idx: string, column: string, position: string) {
		this.listMap.set(key, {
			channelID: this.globalService.GetSqlListChannel(),
			selectSub: undefined,
			sqlListDef: {
				table_name: table, 
				idx_name: idx,
				column_name: column,
				position_name: position,
				asFilter: false,
				filter_column_name: null,
				filter_value: null,
				humanRating_value: 10,
				calcRating_value: 10,
			},
			sqlList: new Array<ISqlList>(),
			sqlMap: new Map<number, string>(),
		});
		this.sqlGetList(key);
	}

	private sqlGetList(key: string){

		this.isReady$.next(false);
		this.subject = this.webSocketService.webSocketSubject;

		this.listMap.get(key).sqlList = [];
		this.listMap.get(key).sqlMap.clear();

		if ((this.listMap.get(key).selectSub === undefined) || (this.listMap.get(key).selectSub.closed === true)) {
			this.listMap.get(key).selectSub = this.subject.subscribe((value) => {
				this.parse(key, value);
			 });
		}
		if (this.listMap.get(key).sqlListDef.asFilter) {
			let message = this.webSocketService
				.prepareMessage(this.listMap.get(key).channelID,'SQL','GET_LIST_FLT',[
					this.listMap.get(key).sqlListDef.table_name,
					this.listMap.get(key).sqlListDef.idx_name,
					this.listMap.get(key).sqlListDef.column_name,
					this.listMap.get(key).sqlListDef.position_name,
					this.listMap.get(key).sqlListDef.filter_column_name,
					this.listMap.get(key).sqlListDef.filter_value,
					this.listMap.get(key).sqlListDef.humanRating_value.toString(),
					this.listMap.get(key).sqlListDef.calcRating_value.toString(),
				]);
			this.subject.next(message);

		} else {
			let message = this.webSocketService
				.prepareMessage(this.listMap.get(key).channelID,'SQL','GET_LIST',[
					this.listMap.get(key).sqlListDef.table_name,
					this.listMap.get(key).sqlListDef.idx_name,
					this.listMap.get(key).sqlListDef.column_name,
					this.listMap.get(key).sqlListDef.position_name,
					this.listMap.get(key).sqlListDef.humanRating_value.toString(),
					this.listMap.get(key).sqlListDef.calcRating_value.toString(),
				]);
			this.subject.next(message);
		}
	}

	public UpdateItemKey(key: string, item: ISqlList) {
		this.subject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.listMap.get(key).channelID,'SQL','UPDATE_LIST',[
				this.listMap.get(key).sqlListDef.table_name,
				this.listMap.get(key).sqlListDef.idx_name,
				this.listMap.get(key).sqlListDef.column_name,
				this.listMap.get(key).sqlListDef.position_name,
				item.idx.toString(),
				item.value,
				item.position.toString(),
				item.humanRating.toString(),
			]);
		this.subject.next(message);
	}

	public UpdateItem(item: ISqlList) {
		this.UpdateItemKey("default", item);
	}

	public InsertItemKey(key: string, item: ISqlList) {
		this.subject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.listMap.get(key).channelID,'SQL','INSERT_LIST',[
				this.listMap.get(key).sqlListDef.table_name,
				this.listMap.get(key).sqlListDef.column_name,
				this.listMap.get(key).sqlListDef.position_name,
				item.value,
				item.position.toString(),
				item.humanRating.toString(),
			]);
		this.subject.next(message);
	}
	public InsertItem(item: ISqlList) {
		this.InsertItemKey("default", item);
	}

	public DeleteItemKey(key: string, idx: number) {
		this.subject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.listMap.get(key).channelID,'SQL','DELETE_LIST',[
				this.listMap.get(key).sqlListDef.table_name,
				this.listMap.get(key).sqlListDef.idx_name,
				idx.toString(),
			]);
		this.subject.next(message);
	}
	public DeleteItem(idx: number) {
		this.DeleteItemKey("default", idx);
	}

	private parse (key: string, msg: wsMessage) {
		if ( (+msg.payload.channelid === this.listMap.get(key).channelID) && (msg.payload.domain === "SQL")) {
			if (msg.payload.command === "RESP_SQL_LIST") {
				this.listMap.get(key).sqlList.push({
					idx: +msg.payload.data[0], 
					value: msg.payload.data[1],
					position: +msg.payload.data[2],
					humanRating: +msg.payload.data[3],
					calcRating: +msg.payload.data[4],
				});
				this.listMap.get(key).sqlMap.set(
					+msg.payload.data[0], 
					msg.payload.data[1],
				);
			}
			if ((+msg.payload.channelid === this.listMap.get(key).channelID) && ( msg.payload.command === "EOF")) {
				this.isReady$.next(true);
				this.listMap.get(key).selectSub.unsubscribe();
			}
		}
	}
}

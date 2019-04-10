import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { Doc } from '../model/doc';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()

export class DocService {

	private docs: Array<Doc>;

	//private dsSelectSQL: any = 'select S.ID, T.ID as typeID, T.type, S.position, D.info from documentation_list L left join documentation_set S on L.ID=S.listID left join documentations D on S.docID=D.ID left join documentation_type T on D.typeID=T.ID where L.ID=1 order by S.position;';
	private dsSelectSub: Subscription;
	private dsSubject: Subject<any>;
	public channelID: number = 1;
	public baseChannelID: number = 256;

	public isReady$ = new Subject<any>();

  constructor( private webSocketService: WebSocketService ) {
		this.docs = [];
	}

	public setChannelID(channelID: number){
		this.channelID = this.baseChannelID + channelID;
	}

	public getDoc(idx: number): Doc {
		return this.docs.find(k => k.idx === idx);
	}

	public getDocs(): Array<Doc> {
		return this.docs
	}

	public SQLSynchro() {

		this.isReady$.next(false);
		this.docs = [];

		this.dsSubject = this.webSocketService.wsSubject();

		if ((this.dsSelectSub === undefined) || (this.dsSelectSub.closed === true)) {
			this.dsSelectSub = this.dsSubject.subscribe((value) => { this.dsParse(value); });
		}

		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','GET_DOC_BY_ID',['1']);
		this.dsSubject.next(message);
	}

	private dsParse(scMsg: wsMessage) {
		var doc: Doc;
		if ((+scMsg.payload.channelid === this.channelID) && (scMsg.payload.domain === "DOC")) {
			if (scMsg.payload.command === "RESP_DOC_BY_ID") {
				this.docs.push(new Doc(
					+scMsg.payload.data[0],
					+scMsg.payload.data[1],
					scMsg.payload.data[2],
					+scMsg.payload.data[3],
					scMsg.payload.data[4]
				));
			}
		}
		if ((+scMsg.payload.channelid === this.channelID) && (scMsg.payload.command === "EOF")) {
			console.log('Docs EOF');
			this.isReady$.next(true);
			this.dsSelectSub.unsubscribe();
		}		
	}
}

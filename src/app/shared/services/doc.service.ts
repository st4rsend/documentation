import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { Doc } from '../model/doc';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()

export class DocService {

	private docs: Array<Doc>;

	private dsSelectSQL: any = 'select D.ID, T.ID, type, position, D.info from documentations D left join documentation_type T on D.typeID=T.ID order by position';
	private dsSelectSub: Subscription;
	private dsSubject: Subject<any>;
	public channelID: number = 2;

	public isReady$ = new Subject<any>();

  constructor( private webSocketService: WebSocketService ) {
		this.docs = [];
	}

	public setChannelID(channelID: number){
		this.channelID = channelID;
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
			.wsPrepareMessage(this.channelID,'SQL','REQ_SELECT',[this.dsSelectSQL]);
		this.dsSubject.next(message);
	}

	private dsParse(scMsg: wsMessage) {
		var doc: Doc;
		if ((+scMsg.payload.channelid === this.channelID) && (scMsg.payload.domain === "SQL")) {
			if (scMsg.payload.command === "RESP_SELECT_DATA") {
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

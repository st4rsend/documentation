import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { Doc, DocList } from '../model/doc';

import { WebSocketService, wsMessage } from './websocket.service';

@Injectable()


export class DocService {

	private docs: Array<Doc>;
	private docLists: Array<DocList>;

	private dsSelectSub: Subscription;
	private dsSubject: Subject<any>;
	private dsListSelectSub: Subscription;
	private dsListSubject: Subject<any>;
	public channelID: number = 1;
	public listChannelID: number = 258;
	public baseChannelID: number = 256;

	public isReady$ = new Subject<any>();

  constructor( private webSocketService: WebSocketService ) {
		this.docs = [];
	}

	public setChannelID(channelID: number){
		this.channelID = this.baseChannelID + channelID;
	}

	public dsGetDocByID(idx: number): Doc {
		return this.docs.find(k => k.idx === idx);
	}

	public dsGetDocs(): Array<Doc> {
		return this.docs;
	}
	public dsGetDocLists(): Array<DocList> {
		return this.docLists;
	}

	public dsSQLQueryDocs(docListID: string) {

		this.docs = [];

		this.dsSubject = this.webSocketService.wsSubject();
		this.isReady$.next(false);

		if ((this.dsSelectSub === undefined) || (this.dsSelectSub.closed === true)) {
			this.dsSelectSub = this.dsSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_DOC_BY_ID") {
						//console.log(scMsg.payload.data);
						this.docs.push(new Doc(
							+scMsg.payload.data[0],
							+scMsg.payload.data[1],
							scMsg.payload.data[2],
							+scMsg.payload.data[3],
							scMsg.payload.data[4]
						));
					}
				}
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.command === "EOF")) {
					console.log('Docs EOF');
					this.isReady$.next(true);
					this.dsSelectSub.unsubscribe();
				}		
			});
		}

		console.log("docListID: ", docListID);
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','GET_DOC_BY_ID',[docListID]);
		this.dsSubject.next(message);
	}

	public dsSQLQueryDocsList() {
		this.docLists = [];
		this.dsListSubject = this.webSocketService.wsSubject();

		this.isReady$.next(false);

		if ((this.dsListSelectSub === undefined) || (this.dsListSelectSub.closed === true)) {
			this.dsListSelectSub = this.dsListSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.listChannelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_DOC_LIST") {
						this.docLists.push(new DocList(
							scMsg.payload.data[0],
							scMsg.payload.data[1]
						));
					}
				}
				if ((+scMsg.payload.channelid === this.listChannelID)
						&& (scMsg.payload.command === "EOF")) {
					console.log('Docs LIST EOF');
					this.isReady$.next(true);
				}		
			});
		}

		let message = this.webSocketService
			.wsPrepareMessage(this.listChannelID,'DOC','GET_DOC_LIST',['1']);
		this.dsListSubject.next(message);
	}
}

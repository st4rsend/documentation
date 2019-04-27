import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { Doc, DocList, DocType } from '../model/doc';

@Injectable()

export class DocService {

	docs: Array<Doc>;
	docLists: Array<DocList>;
	docTypes: Array<DocType>;

	dsSelectSub: Subscription;
	dsSubject: Subject<any>;
	dsListSelectSub: Subscription;
	dsListSubject: Subject<any>;
	dsTypeSelectSub: Subscription;
	dsTypeSubject: Subject<any>;

	channelID: number = 1;
	listChannelID: number = 258;
	typeChannelID: number = 259;
	baseChannelID: number = 256;

	isReady$ = new Subject<any>();

  constructor( private webSocketService: WebSocketService ) {
		this.docs = [];
	}
	setChannelID(channelID: number){
		this.channelID = this.baseChannelID + channelID;
	}
	dsGetDocByID(idx: number): Doc {
		return this.docs.find(k => k.idx === idx);
	}
	dsGetDocs(): Array<Doc> {
		return this.docs;
	}
	dsGetDocLists(): Array<DocList> {
		return this.docLists;
	}
	dsGetDocTypes(): Array<DocType> {
		return this.docTypes;
	}

	dsUpdateDoc(doc: Doc) {
		this.dsSubject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','UPDATE_DOC',[doc.idx.toString(), doc.typeID.toString(), doc.description, doc.value]);
		this.dsSubject.next(message);
		
	}
	dsInsertDoc(doc: Doc, docListID: string ) {
		this.dsSubject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','INSERT_DOC',[
				doc.typeID.toString(),
				doc.description,
				doc.value,
				docListID,
				doc.position.toString()]); 
		this.dsSubject.next(message);
	}

	dsSQLQueryDocs(docListID: string) {
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
							scMsg.payload.data[4],
							scMsg.payload.data[5]
						));
					}
				}
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.command === "EOF")) {
					this.isReady$.next(true);
					this.dsSelectSub.unsubscribe();
				}		
			});
		}
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','GET_DOC_BY_ID',[docListID]);
		this.dsSubject.next(message);
	}

	dsSQLQueryDocLists() {
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
					this.isReady$.next(true);
				}		
			});
		}

		let message = this.webSocketService
			.wsPrepareMessage(this.listChannelID,'DOC','GET_DOC_LIST',['1']);
		this.dsListSubject.next(message);
	}
	
	dsSQLQueryDocTypes() {
		this.docTypes = [];
		this.dsTypeSubject = this.webSocketService.wsSubject();

		this.isReady$.next(false);

		if ((this.dsTypeSelectSub === undefined) || (this.dsTypeSelectSub.closed === true)) {
			this.dsTypeSelectSub = this.dsTypeSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.typeChannelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_DOC_TYPE") {
						this.docTypes.push(new DocType(
							scMsg.payload.data[0],
							scMsg.payload.data[1]
						));
					}
				}
				if ((+scMsg.payload.channelid === this.typeChannelID)
						&& (scMsg.payload.command === "EOF")) {
					this.isReady$.next(true);
				}		
			});
		}

		let message = this.webSocketService
			.wsPrepareMessage(this.typeChannelID,'DOC','GET_DOC_TYPE',['1']);
		this.dsTypeSubject.next(message);
	}
}

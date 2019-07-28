import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { Doc } from '../model/doc';

@Injectable()

export class DocService {

	docs: Array<Doc>;
	private docListID: number;

	dsSelectSub: Subscription;
	dsSubject: Subject<any>;

	private dsListIDSource = new Subject<number>();
	public dsListIDChanged$ = this.dsListIDSource.asObservable();

	channelID: number;
	baseChannelID: number = 256;

	isReady$ = new Subject<any>();

  constructor( private webSocketService: WebSocketService ) {
		this.channelID = this.baseChannelID;
		this.docs = [];
		this.dsListIDChanged$.subscribe(
			idx => {
				this.docListID = idx;
				this.dsSQLQueryDocs();
			});
	}

	public setChannelID(channelID: number){
		console.log("Set channelID: ", channelID);
		this.channelID = this.baseChannelID + channelID;
	}

	public dsSetDocListID(idx: number) {
		this.dsListIDSource.next(idx);
	}

	public dsGetDocByID(idx: number): Doc {
		return this.docs.find(k => k.idx === idx);
	}
	public dsGetDocs(): Array<Doc> {
		return this.docs;
	}

	public dsUpdateDoc(doc: Doc) {
		this.dsSubject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','UPDATE_DOC',[doc.idx.toString(), doc.typeID.toString(), doc.description, doc.value, doc.childListID.toString()]);
		this.dsSubject.next(message);
		
	}
	public dsInsertDoc(doc: Doc) {
		this.dsSubject = this.webSocketService.wsSubject();
		let message = this.webSocketService
			.wsPrepareMessage(this.channelID,'DOC','INSERT_DOC',[
				doc.typeID.toString(),
				doc.description,
				doc.value,
				doc.childListID.toString(),
				this.docListID.toString(),
				doc.position.toString()]); 
		this.dsSubject.next(message);
	}

	public dsSQLQueryDocs() {
		this.docs = [];
		this.dsSubject = this.webSocketService.wsSubject();
		this.isReady$.next(false);
		if (this.docListID != undefined) {	
			this.dsSelectSub = this.dsSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_DOC_BY_ID") {
						this.docs.push(new Doc(
							+scMsg.payload.data[0],
							+scMsg.payload.data[1],
							scMsg.payload.data[2],
							+scMsg.payload.data[3],
							scMsg.payload.data[4],
							scMsg.payload.data[5],
							+scMsg.payload.data[6]
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
			.wsPrepareMessage(this.channelID,'DOC','GET_DOC_BY_ID',[this.docListID.toString()]);
		this.dsSubject.next(message);
	}
}

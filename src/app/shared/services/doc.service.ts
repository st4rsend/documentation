import { Injectable } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { Doc, ArticleShort } from '../model/doc';

@Injectable()

export class DocService {

	public docs: Array<Doc>;
	public articlesShort: Array<ArticleShort>;
	public article: Doc;

	private docListID: number;
	private articleListID: number;

	dsSelectSub: Subscription;
	dsSubject: Subject<any>;

	private dsListIDSource = new Subject<number>();
	public dsListIDChanged$ = this.dsListIDSource.asObservable();

	channelID: number;
	baseChannelID: number = 256;

	isReady$ = new Subject<any>();
	isReadyArticle$ = new Subject<boolean>();

  constructor( private webSocketService: WebSocketService ) {
		this.channelID = this.baseChannelID;
		this.docs = [];
		this.articlesShort = [];
		this.dsListIDChanged$.subscribe(
			idx => {
				this.docListID = idx;
				this.dsSQLQueryDocs();
			});
	}

	public setChannelID(channelID: number){
		this.channelID = this.baseChannelID + channelID;
	}

	public dsSetDocListID(idx: number) {
		this.dsListIDSource.next(idx);
	}

	public getArticle(): Doc {
		return this.article;
	}
	public getDocListID() {
		return this.docListID;
	}

	public dsGetDocByID(idx: number): Doc {
		return this.docs.find(k => k.idx === idx);
	}
	public dsGetDocs(): Array<Doc> {
		return this.docs;
	}
	public getArticlesShort(listID: number): Array<ArticleShort> {
		return this.articlesShort;
	}

	public dsUpdateDoc(doc: Doc) {
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','UPDATE_DOC',[
				doc.idx.toString(),
				doc.description,
				doc.typeID.toString(),
				doc.value,
				doc.childListID.toString(),
				doc.type2ID.toString(),
				doc.value2,
				doc.child2ListID.toString(),
				doc.displayID.toString()]);
		this.dsSubject.next(message);
	}

	public updateDocPosition(listID: number, docID: number, position: number) {
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','UPDATE_DOC_POS',[
				listID.toString(),
				docID.toString(),
				position.toString()]);
		this.dsSubject.next(message);
	}

	public dsInsertDoc(doc: Doc) {
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','INSERT_DOC',[
				doc.description,
				doc.typeID.toString(),
				doc.value,
				doc.childListID.toString(),
				doc.type2ID.toString(),
				doc.value2,
				doc.child2ListID.toString(),
				doc.displayID.toString(),
				this.docListID.toString(),
				doc.position.toString()]); 
		this.dsSubject.next(message);
	}

	public SetListTheme(listID: number, themeTargetID: number) {
		console.log ("Moving listID: ", listID, " to themeID: ", themeTargetID);
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','UPDATE_LIST_THEME',[
				listID.toString(),
				themeTargetID.toString()]);
		this.dsSubject.next(message);
	}

	public dsSQLQueryDocs() {
		this.docs = [];
		this.dsSubject = this.webSocketService.webSocketSubject;
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
							+scMsg.payload.data[6],
							+scMsg.payload.data[7],
							scMsg.payload.data[8],
							scMsg.payload.data[9],
							+scMsg.payload.data[10],
							+scMsg.payload.data[11],
							scMsg.payload.data[12],
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
			.prepareMessage(this.channelID,'DOC','GET_DOC_BY_ID',[this.docListID.toString()]);
		this.dsSubject.next(message);
	}

	public SelectArticlesShort(listID: number) {
		this.articlesShort=[];
		this.dsSubject = this.webSocketService.webSocketSubject;
		this.isReady$.next(false);
		if (listID != undefined) {	
			this.dsSelectSub = this.dsSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_DOC_SHORT_BY_ID") {
						this.articlesShort.push(new ArticleShort(
							+scMsg.payload.data[0],
							+scMsg.payload.data[1],
							scMsg.payload.data[2],
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
			.prepareMessage(this.channelID,'DOC','GET_DOC_SHORT_BY_ID',[listID.toString()]);
		this.dsSubject.next(message);
		
	}
	
	public SelectArticlesByID(articleID: number) {
		this.article = undefined;
		this.dsSubject = this.webSocketService.webSocketSubject;
		this.isReadyArticle$.next(false);
		if (articleID != undefined) {	
			this.dsSelectSub = this.dsSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_ARTICLE_BY_ID") {
						this.article = new Doc(
							+scMsg.payload.data[0],
							0,
							scMsg.payload.data[1],
							+scMsg.payload.data[2],
							scMsg.payload.data[3],
							scMsg.payload.data[4],
							+scMsg.payload.data[5],
							+scMsg.payload.data[6],
							scMsg.payload.data[7],
							scMsg.payload.data[8],
							+scMsg.payload.data[9],
							+scMsg.payload.data[10],
							scMsg.payload.data[11],
						);
					}
				}
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.command === "EOF")) {
					this.isReadyArticle$.next(true);
					this.dsSelectSub.unsubscribe();
				}		
			});
		}
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','GET_ARTICLE_BY_ID',[articleID.toString()]);
		this.dsSubject.next(message);
		
	}
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject ,  Subscription } from 'rxjs';
import { WebSocketService, wsMessage } from '../../shared/service/websocket.service';
import { Doc, ArticleShort, NavHistory, NavAncestors, NavElement } from '../model/doc';

@Injectable()

export class DocService {

	public docs: Array<Doc>;
	public articlesShort: Array<ArticleShort>;
	public article: Doc;

	private docListID: number;
	private articleListID: number;

	private historic: NavHistory = new NavHistory();
	private ancestors: NavAncestors = new NavAncestors();

	dsSelectSub: Subscription;
	dsSubject: Subject<any>;

	dsParentSub: Subscription;

	private dsListIDSource = new Subject<number>();
	public dsListIDChanged$ = this.dsListIDSource.asObservable();

	channelID: number;
	baseChannelID: number = 256;

	private articleEditSub = new Subject<Doc>();
	public articleEditRequest$ = this.articleEditSub.asObservable();

	private articleFocusSub = new Subject<boolean>();
	public articleFocus$ = this.articleFocusSub.asObservable();

	isReady$ = new Subject<any>();
	isReadyArticle$ = new Subject<boolean>();

	articleParentsReady$ = new Subject<boolean>();

	mouseNavigatorTimeout: number = 1000;
	navigatorTimer;

  constructor(
		private webSocketService: WebSocketService,
		private router: Router ) {
		this.channelID = this.baseChannelID;
		this.docs = [];
		this.articlesShort = [];
		this.dsListIDChanged$.subscribe(
			idx => {
				this.docListID = idx;
				this.dsSQLQueryDocs();
			});
	}

	public emitArticleFocus() {
		this.articleFocusSub.next(true);
	}

	public mouseOverArticle() {
		this.cancelNavigatorTimeout();
		this.navigatorTimer = setTimeout(
			() => {
				this.articleFocusSub.next(true);
			}, this.mouseNavigatorTimeout
		);
	}

	public cancelNavigatorTimeout() {
		if (this.navigatorTimer != undefined) {
			clearTimeout(this.navigatorTimer);
		}
	}
		
	public getHistoric() {
		return this.historic.getListFromStart();
	}

	public updateAncestors() {
		this.ancestors.flush();
		this.dsSubject = this.webSocketService.webSocketSubject;
		this.articleParentsReady$.next(false);
		if (this.docListID != undefined) {
			this.dsParentSub = this.dsSubject.subscribe((scMsg) => {
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.domain === "DOC")) {
					if (scMsg.payload.command === "RESP_ARTICLE_PARENT") {
						this.ancestors.push(new NavElement(
							+scMsg.payload.data[0],
							scMsg.payload.data[1],
						));
					}
				}
				if ((+scMsg.payload.channelid === this.channelID)
						&& (scMsg.payload.command === "EOF")) {
					this.articleParentsReady$.next(true);
					this.dsParentSub.unsubscribe();
				}		
			});
		}
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','GET_ARTICLE_PARENT',[this.docListID.toString()]);
		this.dsSubject.next(message);
	}

	public getAncestors() {
		return this.ancestors.getAncestors();
	}

	public historicBack() {
		if (this.historic.size() > 0) {
			this.historic.back();
			this.dsListIDSource.next(this.historic.getCurrentIdx());
		}
	}

	public historicForward() {
		if (this.historic.size() > 0) {
			this.historic.forward();
			this.dsListIDSource.next(this.historic.getCurrentIdx());
		}
	}

	public historicCursor() {
		return this.historic.getCursor();
	}

	public historicNav(cursor: number) {
		this.historic.setCursor(cursor);
		this.dsListIDSource.next(this.historic.getIdx(cursor));
	}

	public ancestorsNav(idx: number) {
		this.dsListIDSource.next(idx);
	}

	public refresh() {
		this.dsListIDSource.next(this.docListID);
	}

	public articleEdit(article: Doc){
		this.articleEditSub.next(article);
	}

	public setChannelID(channelID: number){
		this.channelID = this.baseChannelID + channelID;
	}

	public navigate(idx: number, description: string) {
		if (idx != this.historic.getCurrentIdx()) {
			let navElement = new NavElement(idx, description);
			this.historic.addElement(navElement);
			this.historic.toLast();
		}
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
		//console.log ("Moving listID: ", listID, " to themeID: ", themeTargetID);
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','UPDATE_LIST_THEME',[
				listID.toString(),
				themeTargetID.toString()]);
		this.dsSubject.next(message);
	}

	public DelArticleFromList(articleID: number, listID: number) {
		//console.log ("Delete articleID: ", articleID, " from ListID: ", listID);
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','DELETE_ARTICLE_LIST',[
				listID.toString(),
				articleID.toString()]);
		this.dsSubject.next(message);
	}

	public AddArticleToList(articleID: number, listID: number) {
		//console.log("Add articleID: ", articleID, " to listID: ", listID);
		this.dsSubject = this.webSocketService.webSocketSubject;
		let message = this.webSocketService
			.prepareMessage(this.channelID,'DOC','ADD_ARTICLE_LIST',[
				listID.toString(),
				articleID.toString()]);
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
					this.updateAncestors();
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

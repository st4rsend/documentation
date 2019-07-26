import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

	private	channelID: number = 1;
	private connectID: number = 0;
	private isConnectedSubject$ = new Subject<number>();

	private scDomain: string = 'SEC';
	private scCommand: string;
	private scSubject: Subject<any>;
	private scMessage: Array<string>;

	isReady$ = new Subject<boolean>();
	authSub: Subscription;

  constructor( private webSocket: WebSocketService ) {
		console.log("creating authentication service");
	 }

	public connected() {
		return this.isConnectedSubject$.asObservable();
	}

	public loginChallenge(user: string, password: string) {
		this.connectID = 0;
		this.isReady$.next(false);
		if ((this.authSub === undefined) || (this.authSub.closed === true)) {
			this.authSub = this.webSocket.wsSubject().subscribe((msg) => {
				this.parseAuth(msg);
			});
		}
		this.scCommand = "LOGIN";
		this.scMessage = [user, password];
		this.scSubject = this.webSocket.wsSubject();
		let message1 = this.webSocket.wsPrepareMessage(this.channelID, this.scDomain,this.scCommand,[user, password]);
		this.scSubject.next(message1);


		if (user == "vince" && password == "aaa") {
			this.connectID = 1;
			console.log("setting connected");
		}	
		this.isConnectedSubject$.next(this.connectID);
		
	}

	public getUserInfo(UID: number) {
		this.isReady$.next(false);
		if ((this.authSub === undefined) || (this.authSub.closed === true)) {
			this.authSub = this.webSocket.wsSubject().subscribe((msg) => {
				this.parseAuth(msg);
			});
		}
		this.scMessage = [];
		this.scMessage.push(JSON.stringify(UID));
		let message = this.webSocket.wsPrepareMessage(1,"SEC","USR_INFO",this.scMessage);
		this.webSocket.wsSubject().next(message);
	}

	private parseAuth(msg: wsMessage) {

		if ((+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SEC")) {
			if (msg.payload.command === "RESP_LOGIN") {
				console.log("RESP_LOGIN", msg);
			}
		}
		if ((+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SEC")) {
			if (msg.payload.command === "RESP_USR_INF") {
				console.log ("RESP_AUTH_USER: ",msg);
			}
			if (msg.payload.command === "RESP_UG_INF") {
				console.log ("RESP_AUTH_GROUP: ",msg);
			}
		
		}
		if ((+msg.payload.channelid == this.channelID) && (msg.payload.command === "EOF"))	{
			console.log ("EOF");
			this.isReady$.next(true);
			this.authSub.unsubscribe();
		}
	}
}

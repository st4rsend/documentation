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

	private domain: string = 'SEC';
	private command: string;
	private subject: Subject<any>;
	private message: Array<string>;

	isReady$ = new Subject<boolean>();
	authSub: Subscription;

  constructor( 
		private webSocketSvc: WebSocketService,
		private globalSvc: GlobalService ) {
//		console.log("creating authentication service");
	 }

	public connected() {
		return this.isConnectedSubject$.asObservable();
	}

	public logout() {
		this.connectID = 0;
		this.isReady$.next(false);
		this.command = "LOGOUT";
		this.message = [];
		let message1 = this.webSocketSvc.prepareMessage(this.channelID, this.domain,this.command,this.message);
		this.webSocketSvc.webSocketSubject.next(message1);
		
	}

	public loginChallenge(user: string, password: string) {
		this.connectID = 0;
		this.isReady$.next(false);
		if ((this.authSub === undefined) || (this.authSub.closed === true)) {
			this.authSub = this.webSocketSvc.webSocketSubject.subscribe((msg) => {
				this.parseAuth(msg);
			});
		}
		this.command = "LOGIN";
		this.message = [user, password];
		let message1 = this.webSocketSvc.prepareMessage(this.channelID, this.domain,this.command,this.message);
		this.webSocketSvc.webSocketSubject.next(message1);
	}

	public getUserInfo(UID: number) {
		this.isReady$.next(false);
		if ((this.authSub === undefined) || (this.authSub.closed === true)) {
			this.authSub = this.webSocketSvc.webSocketSubject.subscribe((msg) => {
				this.parseAuth(msg);
			});
		}
		this.message = [];
		this.message.push(JSON.stringify(UID));
		let message = this.webSocketSvc.prepareMessage(1,"SEC","USR_INFO",this.message);
		this.webSocketSvc.webSocketSubject.next(message);
	}

	private parseAuth(msg: wsMessage) {

		if ((+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SEC")) {
			if (msg.payload.command === "RESP_LOGIN") {
				this.connectID = +msg.payload.data[0];
				if (this.connectID == 0) {
					this.globalSvc.ResetUser();
				} 
				this.isConnectedSubject$.next(this.connectID);
			}
		}
		if ((+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SEC")) {
			if (msg.payload.command === "RESP_USR_INF") {
				this.globalSvc.SetUserInfo(
					+msg.payload.data[0],
					msg.payload.data[1],
					msg.payload.data[2],
					msg.payload.data[3]
				);
				console.log ("RESP_AUTH_USER: ",msg);
			}
			if (msg.payload.command === "RESP_UG_INF") {
				this.globalSvc.AddUserGroup(
					+msg.payload.data[0],
					msg.payload.data[1],
					+msg.payload.data[2]
				);
				console.log ("RESP_AUTH_GROUP: ",msg);
			}
		
		}
		if ((+msg.payload.channelid == this.channelID) && (msg.payload.command === "EOF"))	{
//			console.log ("parseAuth EOF");
			this.isReady$.next(true);
			this.authSub.unsubscribe();
		}
	}
}

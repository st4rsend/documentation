import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

	private	channelID: number = 1;
	private userID: number = 0;
	//private userIDSubject$ = new Subject<number>();
	private userIDSubject$ = new BehaviorSubject<number>(0);
	public userId$ = this.userIDSubject$.asObservable();

	private domain: string = 'SEC';
	private command: string;
	private subject: Subject<any>;
	private message: Array<string>;

	isReady$ = new Subject<boolean>();
	loginSub: Subscription;
	registerSub: Subscription;

  constructor( 
		private webSocketSvc: WebSocketService,
		private globalSvc: GlobalService ) { }

	public connected() {
		return this.userIDSubject$.asObservable();
	}

	public logout() {
		this.userID = 0;
		this.isReady$.next(false);
		this.command = "LOGOUT";
		this.message = [];
		let message1 = this.webSocketSvc.prepareMessage(this.channelID, this.domain,this.command,this.message);
		this.webSocketSvc.webSocketSubject.next(message1);
		this.userIDSubject$.next(this.userID);		
	}

	public loginChallenge(user: string, password: string) {
		this.userID = 0;
		this.isReady$.next(false);
		if ((this.loginSub === undefined) || (this.loginSub.closed === true)) {
			this.loginSub = this.webSocketSvc.webSocketSubject.subscribe((msg) => {
				this.authParse(msg);
			});
		}
		this.command = "LOGIN";
		this.message = [user, password];
		let message1 = this.webSocketSvc.prepareMessage(this.channelID, this.domain,this.command,this.message);
		this.webSocketSvc.webSocketSubject.next(message1);
	}

	public registerUser(user: string, password: string, firstname: string, lastname: string, eMail: string) {
		console.log("Registering\nUser: ", user,"\npassword: ", password,"\ne-mail: ",eMail);
		this.isReady$.next(false);
		if ((this.registerSub === undefined) || (this.registerSub.closed === true)) {
			this.registerSub = this.webSocketSvc.webSocketSubject.subscribe((msg) => {
				this.authParse(msg);
			});
		}
		this.command = "REGISTER";
		this.message = [user, password, firstname, lastname, eMail];
		let message1 = this.webSocketSvc.prepareMessage(
			this.channelID,
			this.domain,
			this.command,
			this.message);
		this.webSocketSvc.webSocketSubject.next(message1);
	}

	public getUserInfo(UID: number) {
		this.isReady$.next(false);
		if ((this.loginSub === undefined) || (this.loginSub.closed === true)) {
			this.loginSub = this.webSocketSvc.webSocketSubject.subscribe((msg) => {
				this.authParse(msg);
			});
		}
		this.message = [];
		this.message.push(JSON.stringify(UID));
		let message = this.webSocketSvc.prepareMessage(1,"SEC","USR_INFO",this.message);
		this.webSocketSvc.webSocketSubject.next(message);
	}

	public setPassword(oldPassword: string, newPassword: string) {
		this.isReady$.next(false);
		if ((this.loginSub === undefined) || (this.loginSub.closed === true)) {
			this.loginSub = this.webSocketSvc.webSocketSubject.subscribe((msg) => {
				this.authParse(msg);
			});
		}
		this.message = [];
		this.message = [oldPassword, newPassword];
		let message = this.webSocketSvc.prepareMessage(1,"SEC","SET_PWD",this.message);
		this.webSocketSvc.webSocketSubject.next(message);
	}

	private authParse(msg: wsMessage) {

		if ((+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SEC")) {
			if (msg.payload.command === "RESP_LOGIN") {
				this.userID = +msg.payload.data[0];
				if (this.userID == 0) {
					this.globalSvc.ResetUser();
				} 
				this.userIDSubject$.next(this.userID);
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
		if ((+msg.payload.channelid === this.channelID) && (msg.payload.domain === "SEC")) {
			if (msg.payload.command === "RESP_REGISTER") {
				console.log("RESP_REGISTER: ", msg.payload.data);
			}
		}
		if ((+msg.payload.channelid == this.channelID) && (msg.payload.command === "EOF"))	{
//			console.log ("parseAuth EOF");
			this.isReady$.next(true);
			this.loginSub.unsubscribe();
		}
	}
}

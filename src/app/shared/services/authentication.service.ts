import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebSocketService, wsMessage } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

	private connectID: number = 0;
	private isConnectedSubject$ = new Subject<number>();

	private scDomain: string = 'SEC';
	private scCommand: string;
	private scSubject: Subject<any>;
	private scMessage: Array<string>;

  constructor( private scWebsocket: WebSocketService ) {
		console.log("creating authentication service");
	 }

	public loginChallenge(user: string, password: string) {
		this.connectID = 0;

		this.scCommand = "LOGIN";
		this.scMessage = [user, password];
		this.scSubject = this.scWebsocket.wsSubject();
		let message1 = this.scWebsocket.wsPrepareMessage(0,this.scDomain,this.scCommand,[user, password]);
		this.scSubject.next(message1);


		if (user == "vince" && password == "aaa") {
			this.connectID = 1;
			console.log("setting connected");
		}	
		this.isConnectedSubject$.next(this.connectID);
		
	}
	public connected() {
		return this.isConnectedSubject$.asObservable();
	}
}

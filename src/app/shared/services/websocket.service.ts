import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

interface timeStamp {
  secSinceEpoch : number;
  nanoSec : number;
}

interface comEncap {
  channelid : number;
  domain : string;
  command : string;
  data : string[]
}

export interface wsMessage {
  sequence : number;
  time : timeStamp;
  payload : comEncap;
}

@Injectable({
	providedIn: 'root'
})

export class WebSocketService {

  constructor() { }

	private wsConnected$ = new Subject<any>();
	public webSocket: WebSocket;
	private currentSeq: number = 1;

	private socket: WebSocketSubject<any>;
	private genericSubscription: Subscription;

	public wsPrepareMessage(channelid: number, domain: string, command: string, data: string[]): wsMessage {
		let message: wsMessage = {
			sequence: this.currentSeq,
			time: {
				secSinceEpoch: Math.floor(Date.now()/1000),
				nanoSec: (Date.now() % 1000) * 1000000
			},
			payload: {
				channelid: channelid,
				domain: domain,
				command: command,
				data: data
			},
		}
		this.currentSeq++;
		return message;
	}

	public wsConnect(url: string){
		this.socket = webSocket(url);
		this.genericSubscription = this.socket.subscribe((msg) => {
			this.genericParse(msg);
		});
		this.wsConnected$.next(true);
	}

	public wsDisconnect(){
		this.currentSeq = 1;
		this.wsConnected$.next(false);
	}

	public connected(): Observable<any> {
		return this.wsConnected$.asObservable();
	}

	public wsSubject() : Subject<any> {
		return this.socket;	
		
	}

	public genericParse(msg: wsMessage){
		if  ((+msg.payload.channelid === 0) && (msg.payload.domain === "HBT")) {
		console.log("received heartbeat");
	}
}

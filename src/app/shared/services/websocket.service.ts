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


	private isConnected: boolean = false;
	private wsConnected$ = new Subject<boolean>();
	private currentSeq: number = 1;

	public webSocketSubject: WebSocketSubject<wsMessage>;
	private genericSubscription: Subscription;
	private messages: Array<string>;

	private trackDebug: Subscription;

	private hbtInterval: number = 3000;
	private hbtTicker: number;
	private hbtHoldTime: number = 9000;
	private hbtHoldTicker: number;

  constructor() { 
		this.messages = [];
	}

	public connected(): Observable<any> {
		return this.wsConnected$.asObservable();
	}

	public prepareMessage(channelid: number, domain: string, command: string, data: string[]): wsMessage {
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

	public connect(url: string){
		this.webSocketSubject = webSocket(url);
		this.genericSubscription = this.webSocketSubject.subscribe(
			(msg) => this.genericParse(msg),
			(err) => this.socketError(err),
			() => this.wsConnected$.next(false)
		);
		this.hbtTicker = setInterval(
			() => {
				this.webSocketSubject.next(this.prepareMessage(0,"HBT","HBTINF",[]));
			},this.hbtInterval
		);
		this.hbtHoldTicker = setTimeout(
			() => {
				this.hbtHoldFail();
			}, this.hbtHoldTime
		);
	}

	public sendDebugMessage(
			channel: number,
			domain: string,
			command: string,
			messages: string[],
			parser,
			context
		) {
		this.trackDebug = this.webSocketSubject.subscribe(
			(x: wsMessage) => {
				if(parser(x, context)) {
					this.trackDebug.unsubscribe();
				};
			}
		);
		let message1 = this.prepareMessage(channel, domain, command, messages);
		this.webSocketSubject.next(message1);
	}

	public disconnect(){
		this.currentSeq = 1;
		clearInterval(this.hbtTicker);
		clearTimeout(this.hbtHoldTicker);
		this.genericSubscription.unsubscribe();
		this.webSocketSubject.complete();
		this.isConnected = false;
		this.wsConnected$.next(false);
	}

	public setServerVerbosity(value: string) {
		this.messages = [];
		this.messages.push(JSON.stringify(parseInt(value)));
		let message =  this.prepareMessage(0,"CMD","VERBOSITY",this.messages);
		if (this.webSocketSubject != null) {
			this.webSocketSubject.next(message);
		}
	}

	public genericParse(msg: wsMessage){
		if(!this.isConnected) {
			this.isConnected =  true;
			this.wsConnected$.next(true);
		}
		if  ((+msg.payload.channelid === 0) && (msg.payload.domain === "HBT")) {
			clearTimeout(this.hbtHoldTicker);	
			this.hbtHoldTicker = setTimeout(() => {
				this.hbtHoldFail();
			}, this.hbtHoldTime);
		}
	}

	private socketError(err) {
		console.log("Socket Error: ", err);
		clearTimeout(this.hbtHoldTicker);	
		this.isConnected = false;
		this.wsConnected$.next(false);
	}

	private hbtHoldFail() {
		console.log("ALERT HBT HOLDTIME EXPIRED !!!");
		clearTimeout(this.hbtHoldTicker);	
		this.disconnect();
	}
}

import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


interface timeStamp {
  secSinceEpoch : number;
  nanoSec : number;
}

interface comEncap {
  channelID : number;
  domain : string;
  command : string;
  data : [string]
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

	public wsPrepareMessage(channelID: number, domain: string, command: string, data: [string]): wsMessage {
		let message: wsMessage = {
			sequence: this.currentSeq,
			time: {
				secSinceEpoch: Math.floor(Date.now()/1000),
				nanoSec: (Date.now() % 1000) * 1000000
			},
			payload: {
				channelID: channelID,
				domain: domain,
				command: command,
				data: data
			},
		}
		this.currentSeq++;
		return message;
	}

	public wsConnect(url: string){
		this.webSocket = new WebSocket(url);
		this.wsConnected$.next(true);
	}

	public wsDisconnect(){
		this.webSocket.close();
		this.wsConnected$.next(false);
	}

	public connected(): Observable<any> {
		return this.wsConnected$.asObservable();
	}

	public wsCreateSubject(): Rx.Subject<MessageEvent> {
		let observable = Rx.Observable.create(
			(obs: Rx.Observer<MessageEvent>) => {
				this.webSocket.onmessage = obs.next.bind(obs);
				this.webSocket.onerror = obs.error.bind(obs);
				this.webSocket.onclose = obs.complete.bind(obs);
				return this.webSocket.close.bind(this.webSocket);
		});

		let observer = {
			next: (dataText: string) => {
				if (this.webSocket.readyState === WebSocket.OPEN) {
					 this.webSocket.send(JSON.stringify(dataText));
				}
			},
			error: (str: string) => {
				console.error("OBSERVER ERROR:", str);
			},
			complete: (str: string) => {
				console.log("OBSERVER COMPLETE:", str);
			}
		}
		return Rx.Subject.create(observer, observable);
	}
}

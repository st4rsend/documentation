import { Injectable } from '@angular/core';

import * as Rx from 'rxjs/Rx';

import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

interface timeStamp {
	secSinceEpoch : number;
	nanoSec : number;
}

interface comEncap {
	channelID : number;
	domain : string;
	command : string;
	//data : [object]
	data : [string]
}

export interface wsMessage {
	sequence : number;
	time : timeStamp;
	payload : comEncap;
}

@Injectable()

export class WebSocketService {

  constructor() { }

	private subject: Rx.Subject<MessageEvent>;
	private connected$ = new Subject<any>();

	public connect(url): Rx.Subject<MessageEvent> {
		if (!this.subject) {
			this.subject = this.create(url);
			console.log("Successfully connected: " + url);
			this.connected$.next(true);
		}
		return this.subject;
	}

	public connected(): Observable<any> {
		return this.connected$.asObservable();
	}

	private create(url): Rx.Subject<MessageEvent> {
		let ws = new WebSocket(url);

		let observable = Rx.Observable.create(
			(obs: Rx.Observer<MessageEvent>) => {
				ws.onmessage = obs.next.bind(obs);
				ws.onerror = obs.error.bind(obs);
				ws.onclose = obs.complete.bind(obs);
				return ws.close.bind(ws);
		})

		let observer =  {
			//next: (dataText: Object) => {
			next: (dataText: string) => {
				if (ws.readyState === WebSocket.OPEN) {


					let message: wsMessage = { 
						sequence: 0, 
						time: { 
							secSinceEpoch: 1534500630,
							nanoSec: 60832341
						},
						payload: {
							channelID: 0,
							domain: "CMD",
							command: "VERBOSITY",
							//data: [JSON.parse('{"data":"VERBOSE ON"}').data]
							data: ["VERBOSE ON"]
						},
					}
					ws.send(JSON.stringify(message));

					let message1: wsMessage = { 
						sequence: 1, 
						time: { 
							secSinceEpoch: 1534500630,
							nanoSec: 60832341
						},
						payload: {
							channelID: 0,
							domain: "SQL",
							command: "REQ_SELECT",
							//data: [dataText]
							data: [dataText]
						},
					}
					ws.send(JSON.stringify(message1));
				}
			}
		}
		return Rx.Subject.create(observer, observable);
	}

}

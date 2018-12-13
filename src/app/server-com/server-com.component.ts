import {scan} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { WebSocketService, wsMessage } from '../shared/services/websocket.service';

@Component({
	selector: 'app-server-com',
	templateUrl: './server-com.component.html',
	styleUrls: ['./server-com.component.scss'],
})

export class ServerComComponent {

	//TODO: @output to send websocket status
	@Output() st4rsendMsg = new EventEmitter<string>();


	private scSubConnected: Subscription;
	private scSubMessages: Subscription;
	public scIsConnected = false;

	private scAddress: any = 'wss://dev.st4rsend.net/ws';

	private scDomain: string = 'SQL';
	private scCommand: string = 'REQ_SELECT';
	public scMessage: any = 'select T.ID, identity, U.ID, task, status from todos T left join users U on T.userID = U.ID where U.ID=3';

	private scSubject: Subject<any>;
	private scMessages: Array<string>;
	public scVerbosityFlag: boolean = false;
	public scDebugFlag: boolean = false;

	public heartbeat: number;

	constructor(private scWebsocket: WebSocketService) {
		this.scMessages = [];
	}

	public scConnect() {
		this.scSubConnected = this.scWebsocket.connected().subscribe(status => {
			this.scIsConnected = status;
		});

		this.scWebsocket.wsConnect(this.scAddress);
		this.toAppComponent("Message from ServerCom component");
	}

	public scDisconnect() {
		this.scWebsocket.wsDisconnect();
	}

	public scSend() {
		this.scMessages = [];
		this.scSubject = this.scWebsocket.wsSubject();
		this.scSubject.subscribe(
			(x: wsMessage) => {
				this.scMessages.push(JSON.stringify(x));
			},
		);
		let message1 = this.scWebsocket.wsPrepareMessage(0,this.scDomain,this.scCommand,[this.scMessage]);
		this.scSubject.next(message1);
	}

	private toAppComponent(msg: string) {
		this.st4rsendMsg.emit(msg);
	}


	public scVerbosity() {
		let data: string;	
		if (this.scVerbosityFlag) {
			data = "VERBOSE ON";
		} else {
			data = "VERBOSE OFF";
		}
		let message: wsMessage = {
			sequence: 0,
			time: {
				secSinceEpoch: Math.floor(Date.now()/1000),
				nanoSec: (Date.now() % 1000) * 1000000
			},
			payload: {
				channelid: 0,
				domain: "CMD",
				command: "VERBOSITY",
				data: [data]
			},
		}
		if (this.scSubject != null) {
			this.scSubject.next(message);
		}
		console.log("Verbosity: ", this.scVerbosityFlag);
	}
}

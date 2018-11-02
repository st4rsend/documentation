
import {scan} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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

	private consoleVisible: boolean = false;

	private scSubConnected: Subscription;
	private scSubMessages: Subscription;
	private scIsConnected = false;

	private scAddress: any = 'wss://dev.st4rsend.net/ws';

	private scDomain: string = 'SQL';
	private scCommand: string = 'REQ_SELECT';
	public scMessage: any = 'select T.ID, identity, U.ID, task, status from todos T left join users U on T.userID = U.ID where U.ID=3';

	private scSubject: Subject<any>;
	private scMessageLog: any = '';
	private scVerbosityFlag: boolean = false;


	@ViewChild('scSt4rsend_console') scSt4rsend_console: ElementRef;
	constructor(private scWebsocket: WebSocketService) {

	}

	private scConnect() {
		this.scSubConnected = this.scWebsocket.connected().subscribe(status => {
			this.scIsConnected = status;
		});

		this.scWebsocket.wsConnect(this.scAddress);
		this.toAppComponent("Message from ServerCom component");
	}

	private scDisconnect() {
		this.scWebsocket.wsDisconnect();
	}

	public scSend() {
		this.scSubject = this.scWebsocket.wsSubject();
		 this.scSubject.subscribe({
			next(x) { },}
		);
		if (this.consoleVisible) {
			this.scMessageLog = this.scSubject.pipe(scan((scCurrent, scChange) => {
				this.scScrollEnd();
				//return [...scCurrent, scChange.data];
				return [...scCurrent, scChange];
			}, []));
		} 
		let message1 = this.scWebsocket.wsPrepareMessage(0,this.scDomain,this.scCommand,[this.scMessage]);
		this.scSubject.next(message1);
	}

	private toAppComponent(msg: string) {
		this.st4rsendMsg.emit(msg);
	}

	private toggleConsole(event){
		this.consoleVisible = !this.consoleVisible;
	}

	private scPrint(scMsgEvent: MessageEvent): MessageEvent {
		if (this.scVerbosityFlag) {
			console.log(scMsgEvent);
		}
		let scMsg: wsMessage; 
		try {
			scMsg = JSON.parse(scMsgEvent.data);
		}
		catch(e){
			console.log("SCERROR: PARSE: Couldn't parse as JSON from websocket");
			return scMsgEvent;
		}
		return scMsgEvent;
	}

	private scVerbosity() {
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

	private scScrollEnd() {
		setTimeout( () => {
			this.scSt4rsend_console.nativeElement.scrollTop = this.scSt4rsend_console.nativeElement.scrollHeight;
		}, 100);
	}
}

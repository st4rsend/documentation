//import {scan} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { WebSocketService, wsMessage } from '../../shared/services/websocket.service';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
	selector: 'app-server-com',
	templateUrl: './server-com.component.html',
	styleUrls: ['./server-com.component.scss'],
})

export class ServerComComponent {

	//TODO: @output to send websocket status
	@Output() st4rsendMsg = new EventEmitter<string>();


	private subConnected: Subscription;
	private subMessages: Subscription;
	public isConnected = false;
	public isLogged = false;
	public displayLogin = false;

	private address: any = 'wss://st4rsend.net/ws';

	private domain: string = 'SQL';
	private command: string = 'REQ_SELECT';
	public message: any = 'select T.ID, identity, U.ID, task, status from todos T left join users U on T.userID = U.ID where U.ID=3';

	private subject: Subject<any>;
	private messages: Array<string>;
	public verbosityFlag: string;
	public debugFlag: boolean = false;

	public heartbeat: number;

	constructor(
		private websocket: WebSocketService,
		private authService: AuthenticationService) {
		this.messages = [];
		this.verbosityFlag = "4";
	}

	public connect() {
		this.subConnected = this.websocket.connected().subscribe(status => {
			this.isConnected = status;
		});

		this.websocket.wsConnect(this.address);
		//this.toAppComponent("Message from ServerCom component");
	}

	public disconnect() {
		if (this.isConnected) {
			this.logout();
		}
		this.websocket.wsDisconnect();
	}

	public send() {
		this.messages = [];
		this.subject = this.websocket.wsSubject();
		this.subject.subscribe(
			(x: wsMessage) => {
				this.messages.push(JSON.stringify(x));
			},
		);
		let message1 = this.websocket.wsPrepareMessage(0,this.domain,this.command,[this.message]);
		this.subject.next(message1);
	}

	private toAppComponent(msg: string) {
		this.st4rsendMsg.emit(msg);
	}


	public verbosity() {
		this.messages = [];
		this.messages.push(JSON.stringify(parseInt(this.verbosityFlag)));
		this.subject = this.websocket.wsSubject();
		let message =  this.websocket.wsPrepareMessage(0,"CMD","VERBOSITY",this.messages);
		if (this.subject != null) {
			this.subject.next(message);
		}
	}

	public login() {
		this.displayLogin = !this.displayLogin;
	}
	public logout() {
		this.authService.logout();
		this.isLogged = false;
	}

	public getUserInfo() {
		this.authService.getUserInfo(5);
	}

	public loginCloseEvent(value: boolean) {
		this.displayLogin = false;
		this.isLogged = value;
	}
}

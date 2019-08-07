//import {scan} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Subscription } from 'rxjs';


import { WebSocketService, wsMessage } from '../../shared/services/websocket.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { GlobalService } from '../../shared/services/global.service';

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
	private subDebugFlag: Subscription;
	public isConnected = false;
	public isLogged = false;
	public displayLogin = false;

	private address: any = 'wss://st4rsend.net/ws';

	private domain: string = 'SQL';
	private command: string = 'REQ_SELECT';
	public message: any = 'select T.ID, identity, U.ID, task, status from todos T left join users U on T.userID = U.ID where U.ID=3';

	private subject: Subject<any>;
	private messages: Array<string>;
	public verbosityServerFlag: string;
	public verbosityClientFlag: string;
	public debugFlag: boolean = false;

	public heartbeat: number;

	constructor(
		private websocketS: WebSocketService,
		private globalS: GlobalService,
		private authS: AuthenticationService) {
		this.messages = [];
		this.verbosityClientFlag = "4";
		this.verbosityServerFlag = "4";
		this.subDebugFlag = this.globalS.debugFlag$.subscribe( flag => { 
				this.debugFlag = flag; 
				console.log ("received debug flag: ", flag);
		});
		this.debug(false);
	}

	public connect() {
		this.subConnected = this.websocketS.connected().subscribe(status => {
			this.isConnected = status;
		});

		this.websocketS.wsConnect(this.address);
		//this.toAppComponent("Message from ServerCom component");
	}

	public disconnect() {
		if (this.isConnected) {
			this.logout();
		}
		this.websocketS.wsDisconnect();
	}

	public debug(flag: boolean) {
		this.globalS.setDebugFlag(flag);
	}

	public send() {
		this.messages = [];
		this.websocketS.wsSubject().subscribe(
			(x: wsMessage) => {
				this.messages.push(JSON.stringify(x));
			},
		);
		let message1 = this.websocketS.wsPrepareMessage(0,this.domain,this.command,[this.message]);
		this.websocketS.wsSubject().next(message1);
	}

	private toAppComponent(msg: string) {
		this.st4rsendMsg.emit(msg);
	}


	public verbosityServer() {
		this.messages = [];
		this.messages.push(JSON.stringify(parseInt(this.verbosityServerFlag)));
		let message =  this.websocketS.wsPrepareMessage(0,"CMD","VERBOSITY",this.messages);
		if (this.websocketS.wsSubject() != null) {
			this.websocketS.wsSubject().next(message);
		}
		this.globalS.log(6,"Verbosity server msg: ", message);
	}
	public verbosityClient() {
		this.globalS.setVerbosity(this.verbosityClientFlag);
	}

	public login() {
		this.displayLogin = !this.displayLogin;
	}
	public logout() {
		this.authS.logout();
		this.isLogged = false;
	}

	public getUserInfo() {
		this.authS.getUserInfo(5);
	}

	public loginCloseEvent(value: boolean) {
		this.displayLogin = false;
		this.isLogged = value;
	}
}

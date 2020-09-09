import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebSocketService, wsMessage } from '../../shared/service/websocket.service';
import { GlobalService } from '../../shared/service/global.service';

@Component({
  selector: 'app-mgmt-footer',
  templateUrl: './mgmt-footer.component.html',
  styleUrls: ['./mgmt-footer.component.scss']
})
export class MgmtFooterComponent implements OnInit {

	private subDebugFlag: Subscription; 
	public debugFlag: boolean;
	private subConnected: Subscription; 
	public isConnected: boolean;
	private backendMsgSub: Subscription;
	private subStatusLineCount: Subscription;
 
	public serverVerbosity: string;
	public clientVerbosity: string;

	private webSocketUrl: string;

	private debugChannel: number = 3;
	private debugDomain: string = 'SQL';
	private debugCommand: string = 'GET_LIST';
	public msgToServer: string = "documentation_list\nID\ndescription\nposition";

	public statusLineCount: string = "0em";

	messages: string[];
	backendMsg: string[];

  constructor(
		private globalSvc: GlobalService,
		private webSocketSvc: WebSocketService
	) { 
		this.serverVerbosity = "4";
		this.clientVerbosity = "4";
		this.subStatusLineCount = this.globalSvc.statusLineCount$.subscribe(
			count => {
				this.statusLineCount = count + "em";
		//		console.log("Status Line Count: ", this.statusLineCount);
			}
		);
	}

  ngOnInit() {
		this.webSocketUrl = this.globalSvc.getWebSocketUrl();
		this.subDebugFlag = this.globalSvc.debugFlag$.subscribe (
			flag => {
				this.debugFlag = flag;
			 }
		);
		this.subConnected = this.webSocketSvc.connected$.subscribe(
			flag => {
				this.isConnected = flag;
			}
		);
		this.backendMsg = [];
		this.backendMsgSub = this.webSocketSvc.backendMsg$.subscribe(
			msg => {
				//this.backendMsg.push(JSON.stringify(msg));
				this.backendMsg.push(msg);
		//		console.log("hello world msg: ", msg);
			});
		this.messages = [];
  }
	
	public setWebSocketUrl() {
		this.globalSvc.setWebSocketUrl(this.webSocketUrl);
	}
	public setClientVerbosity() {
		this.globalSvc.setVerbosity(this.clientVerbosity);
	}
	public setServerVerbosity() {
		this.webSocketSvc.setServerVerbosity(this.serverVerbosity);
	}

	public sendDebugMsg() {
		let msgArray: string[] = this.msgToServer.split('\n');
		this.webSocketSvc.sendMessage(
			this.debugChannel,
			this.debugDomain,
			this.debugCommand,
			msgArray, (x: wsMessage) => {
				this.messages.push(JSON.stringify(x));
			}
		);
	}
}

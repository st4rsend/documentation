import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WebSocketService, wsMessage } from '../../shared/services/websocket.service';
import { GlobalService } from '../../shared/services/global.service';

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

	public serverVerbosity: string;
	public clientVerbosity: string;

	private webSocketUrl: string;

	private debugChannel: number = 3;
	private domain: string = 'SQL';
	private command: string = 'GET_LIST';
	public msgToServer: string = "documentation_list\nID\ndescription\nposition";

	messages: string[];

  constructor(
		private globalSvc: GlobalService,
		private webSocketSvc: WebSocketService
	) { 
		this.serverVerbosity = "4";
		this.clientVerbosity = "4";
	}

  ngOnInit() {
		this.webSocketUrl = this.globalSvc.getWebSocketUrl();
		this.subDebugFlag = this.globalSvc.debugFlag$.subscribe (
			flag => {
				this.debugFlag = flag;
			 }
		);
		this.subConnected = this.webSocketSvc.connected().subscribe(
			flag => {
				this.isConnected = flag;
			}
		);
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
		var debugContext = this;
		this.webSocketSvc.sendDebugMessage(
			this.debugChannel,
			this.domain,
			this.command,
			msgArray, this.parseDebugMessage, debugContext);
	}

	public parseDebugMessage(x: wsMessage, context) {
		context.messages.push(JSON.stringify(x));
		if (x.payload.channelid == context.debugChannel
			&& x.payload.command == "EOF") {
				return true;
		}
		return false;
	}

}

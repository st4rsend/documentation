import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

import { WebSocketService } from '../shared/service/websocket.service';
import { AuthenticationService } from '../shared/service/authentication.service';
import { GlobalService } from '../shared/service/global.service';

@Component({
	selector: 'app-server-com',
	templateUrl: './server-com.component.html',
	styleUrls: ['./server-com.component.scss'],
})

export class ServerComComponent implements AfterViewInit {

	@ViewChild('title', { static: true}) elTitle: ElementRef;
	@Output() themeEvent = new EventEmitter<string>();

	private subConnect: Subscription;
	private subDebug: Subscription;
	public connectFlag = false;
	public loginFlag = false;
	public loginDisplayFlag = false;
	public passwordDisplayFlag = false;
	public registerDisplayFlag = false;
	public debugFlag: boolean = false;

	overlay;

	constructor(
		private overlayContainer: OverlayContainer,
		private websocketSvc: WebSocketService,
		private globalSvc: GlobalService,
		private authSvc: AuthenticationService) {
			this.subDebug = this.globalSvc.debugFlag$.subscribe( 
				flag => { 
					this.debugFlag = flag; 
				}
			);
		this.overlay = overlayContainer.getContainerElement();
		this.overlay.classList.add('light-menu-theme');
	}

	public ngAfterViewInit() {
		this.connect();
	}

	public connect() {
		this.subConnect = this.websocketSvc.connected().subscribe(status => {
			this.connectFlag = status;
		});
		this.websocketSvc.connect(this.globalSvc.getWebSocketUrl());
	}

	public disconnect() {
		if (this.connectFlag) {
			this.logout();
		}
		this.websocketSvc.disconnect();
		this.elTitle.nativeElement.classList.remove('cursor-co');
		this.elTitle.nativeElement.classList.add('cursor-notco');
	}

	public debug(flag: boolean) {
		this.globalSvc.setDebugFlag(flag);
	}

	public login() {
		this.loginDisplayFlag = !this.loginDisplayFlag;
	}

	public loginCloseEvent(value: string) {
		this.loginDisplayFlag = false;
		if (value == "true") {
			this.loginFlag = true;
		}
		if (value == "register") {
			this.registerDisplayFlag =  true;
		}
	}

	public logout() {
		this.authSvc.logout();
		this.loginFlag = false;
	}

	public password() {
		this.passwordDisplayFlag = !this.passwordDisplayFlag;
	}

	public passwordCloseEvent(value: boolean) {
		this.passwordDisplayFlag = false;
	}

	public register() {
		this.registerDisplayFlag = !this.registerDisplayFlag;
	}

	public registerCloseEvent(value: boolean) {
		this.registerDisplayFlag = false;
	}

	public getUserInfo() {
		this.authSvc.getUserInfo(5);
	}

	public titleClick() {
		if (!this.connectFlag) {
			this.connect();
		}
		this.elTitle.nativeElement.classList.remove('cursor-notco');
		this.elTitle.nativeElement.classList.add('cursor-co');
	}

	public selectTheme(theme: string) {
		if (theme == 'dark') {
			this.themeEvent.emit('dark-theme');
			this.overlay.classList.remove('light-menu-theme');
			this.overlay.classList.add('dark-menu-theme');
		}
		if (theme == 'light') {
			this.themeEvent.emit('light-theme');
			this.overlay.classList.remove('dark-menu-theme');
			this.overlay.classList.add('light-menu-theme');
		}
		
	}
	public setStatusLineCount(count: string) {
		this.globalSvc.setStatusLineCount(+count);
	}
}

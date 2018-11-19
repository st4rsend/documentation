import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { WebSocketService } from './shared/services/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  title = 'St4rsend';
  name: string = 'John';

	public isConnected: boolean = false;
	private isConnectedSub: Subscription;

	constructor( private webSocket: WebSocketService, private router: Router) {}

	ngOnInit() {
		this.isConnectedSub = this.webSocket.connected()
			.subscribe( x => { this.isConnected = x });
		this.router.navigate(['']);
	}
	toAppComponent(msg: string) {
		console.log("AppComponent received msg: ",msg);
	}
}

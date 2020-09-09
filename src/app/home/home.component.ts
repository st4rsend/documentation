import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../shared/service/global.service';
import { WebSocketService } from '../shared/service/websocket.service';
import { AuthenticationService } from '../shared/service/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	private subConnect: Subscription;
	private subLogin: Subscription;
	public connectFlag: boolean;
	public loginFlag: number;

  constructor(
		private globalSvc: GlobalService,
		private webSocketSvc: WebSocketService,
		private authSvc: AuthenticationService) 
	{}

  ngOnInit() {
		this.subConnect = this.webSocketSvc.connected$.subscribe(
			flag => {
				this.connectFlag = flag;
			}
		);
		this.subLogin = this.authSvc.connected().subscribe(
			flag => {
				this.loginFlag = flag;
			}
		);
  }

}

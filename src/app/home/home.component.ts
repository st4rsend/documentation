import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../shared/services/global.service';
import { WebSocketService } from '../shared/services/websocket.service';
import { AuthenticationService } from '../shared/services/authentication.service';


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
		this.subConnect = this.webSocketSvc.connected().subscribe(
			flag => {
				//console.log("Home connect flag: ", flag);
				this.connectFlag = flag;
			}
		);
		this.subLogin = this.authSvc.connected().subscribe(
			flag => {
				//console.log("Home login flag: ", flag);
				this.loginFlag = flag;
			}
		);
  }

}

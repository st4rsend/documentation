import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-mgmt-footer',
  templateUrl: './mgmt-footer.component.html',
  styleUrls: ['./mgmt-footer.component.scss']
})
export class MgmtFooterComponent implements OnInit {

	private subDebugFlag: Subscription; 
	public debugFlag: boolean;

	private address: any = 'wss://st4rsend.net/ws';
	private domain: string = 'SQL';
	public message: any = 'select T.ID, identity, U.ID, task, status from todos T left join users U on T.userID = U.ID where U.ID=3';

  constructor(private globalS: GlobalService) { }

  ngOnInit() {
		this.subDebugFlag = this.globalS.debugFlag$.subscribe (
			flag => {
				this.debugFlag = flag;
			 }
		);

  }

}

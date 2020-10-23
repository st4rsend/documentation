import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalService } from '../shared/service/global.service';
import { WebSocketService } from '../shared/service/websocket.service';
import { AuthenticationService } from '../shared/service/authentication.service';

import { MathContent } from '../shared/mathjax/math-content';

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

	mathLatex: MathContent = {
    latex: 'When $a \\ne 0$, there are two solutions to $\\frac{5}{9}$'
  };

  mathMl: MathContent = {
    mathml: `<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mrow>
    <mover>
      <munder>
        <mo>∫</mo>
        <mn>0</mn>
      </munder>
      <mi>∞</mi>
    </mover>
    <mtext> versus </mtext>
    <munderover>
      <mo>∫</mo>
      <mn>0</mn>
      <mi>∞</mi>
    </munderover>
  </mrow>
</math>`
  };

}

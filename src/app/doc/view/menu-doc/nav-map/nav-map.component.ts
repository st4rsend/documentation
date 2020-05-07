import { Component, OnInit } from '@angular/core';

import { DocService } from '../../../service/doc.service';
import { NavElement, NavHistory } from '../../../model/doc';

@Component({
  selector: 'app-nav-map',
  templateUrl: './nav-map.component.html',
  styleUrls: ['./nav-map.component.scss']
})
export class NavMapComponent implements OnInit {

	public historic: Array<NavElement>;	
	public keys;

  constructor(
		private docService: DocService,
	) { }

  ngOnInit(): void {
  }

	public getHistoric() {
		this.historic = this.docService.getHistoric();
		console.log("HISTORIC: ", this.historic);
	}

}

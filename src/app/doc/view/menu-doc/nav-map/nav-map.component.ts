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

	public cursor: number = 0;

  constructor(
		private docService: DocService,
	) {
		this.docService.dsListIDChanged$.subscribe(
			idx => {
				this.getHistoric();
			}
		);
	}

  ngOnInit(): void {
		this.getHistoric();
  }

	public getHistoric() {
		this.cursor = this.docService.historicCursor();
		this.historic = this.docService.getHistoric();
	}

	public historicBack() {
		this.docService.historicBack();
	}
	public activateHistoric(cursor: number) {
		this.docService.historicNav(cursor);
	}
}

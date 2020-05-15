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
	public ancestors: Array<NavElement>;

	public historicCursor: number = 0;
	public ancestorsCursor: number = 0;

  constructor(
		private docService: DocService,
	) {
		this.docService.dsListIDChanged$.subscribe(
			idx => {
				this.getHistoric();
				this.getAncestors();
			}
		);
	}

  ngOnInit(): void {
		this.getHistoric();
		this.getAncestors();
  }

	public getHistoric() {
		this.historicCursor = this.docService.historicCursor();
		this.historic = this.docService.getHistoric();
	}

	public getAncestors() {
		this.ancestors = this.docService.getAncestors();
	}

	public activateHistoric(cursor: number) {
		this.docService.historicNav(cursor);
	}

	public activateAncestor(cursor: number) {
		this.docService.ancestorsNav(cursor);
	}
}

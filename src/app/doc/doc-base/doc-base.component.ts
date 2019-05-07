import { Component, OnInit } from '@angular/core';

import { DocService } from '../../shared/services/doc.service';

@Component({
  selector: 'app-doc-base',
  templateUrl: './doc-base.component.html',
  styleUrls: ['./doc-base.component.css'],
	providers: [ DocService ],
})
export class DocBaseComponent implements OnInit {

	public editMode: boolean = false;
	public docListID: string;
	public viewMode: string = "normal";

  constructor(
		private DocService: DocService,
	) { }
  ngOnInit() {
  }
	docEditModeSet(editMode: boolean) {
		this.editMode = editMode;
	}
	docListIDSet(listID: string) {
		this.docListID = listID;
	}
	docViewModeSet(viewMode: string){
		this.viewMode = viewMode;
	}
}

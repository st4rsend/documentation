import { Component, OnInit } from '@angular/core';

import { DocService } from '../../shared/services/doc.service';
import { SqlListService } from '../../shared/services/sql-list.service';

@Component({
  selector: 'app-doc-base',
  templateUrl: './doc-base.component.html',
  styleUrls: ['./doc-base.component.css'],
	providers: [ DocService, SqlListService ],
})
export class DocBaseComponent implements OnInit {

	private editMode: boolean = false;
	private docListID: string;

  constructor(
		private DocService: DocService,
		private DocListService: SqlListService
	) { }

  ngOnInit() {
  }

	docEditModeSet(editMode: boolean) {
		this.editMode = editMode;
	}

	docListIDSet(listID: string) {
		this.docListID = listID;
	}

}

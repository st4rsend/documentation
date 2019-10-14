import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { DocService } from '../../shared/services/doc.service';

@Component({
  selector: 'app-doc-base',
  templateUrl: './doc-base.component.html',
  styleUrls: ['./doc-base.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ DocService ],
})
export class DocBaseComponent implements OnInit {

	public editMode: boolean = false;
	//public docListID: string;
	public viewMode: string = "normal";

  constructor(
		private DocService: DocService,
		private ChangeDetector: ChangeDetectorRef,
	) { }
  ngOnInit() {
  }
	docEditModeSet(editMode: boolean) {
		this.editMode = editMode;
	}
	refresh() {
		console.log("refresh detected in base");
		this.ChangeDetector.detectChanges();
	}
	docViewModeSet(viewMode: string){
		this.viewMode = viewMode;
	}
}

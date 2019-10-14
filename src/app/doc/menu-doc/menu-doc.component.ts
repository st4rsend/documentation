import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
//import { Subscription } from 'rxjs';

import { ListSelectComponent } from '../../shared/component/list-select/list-select.component';

@Component({
  selector: 'app-menu-doc',
  templateUrl: './menu-doc.component.html',
  styleUrls: ['./menu-doc.component.scss'],
})
export class MenuDocComponent implements OnInit {

	@ViewChild('docList', {static: true}) docList: ListSelectComponent;

	@Output() editModeEvent = new EventEmitter<boolean>();
	public docEditMode: boolean = false;
	@Output() viewModeEvent = new EventEmitter<string>();
	@Output() refreshEvent = new EventEmitter();
	public viewMode: string = 'normal';

	public docListTable: string = 'documentation_list';
	public docListIDName: string = 'ID';
	public docListColumn = 'description';
	public docListPosition = 'position';
	public docListFilter = 'themeID';

	public docThemeEditMode: boolean = false;
	public docThemeTable: string = 'documentation_theme';
	public docThemeIDName: string = 'ID';
	public docThemeColumn = 'description';
	public docThemePosition = 'position';

  constructor(
		private docService: DocService,
	) { }

  ngOnInit() {
		this.docList.isReady$.subscribe(
			ready => {
				if ( ready ) {
					this.docList.listID = this.docList.list[0].idx;
					this.docListChange(this.docList.listID);
				}
			});
		this.docService.isReady$.subscribe(
			ready => {
				console.log("DocService Ready is: ", ready);
				if ( ready ) {
					this.refreshEvent.emit();
				}
			});
  }

	docThemeChange(themeID: number) {
		if ( themeID == 0) {
			this.docList.RemoveFilter();
		}
		else {
			this.docList.SetFilter(this.docListFilter, themeID.toString());
		}
	}

	docListChange(listID: number) {
		this.docService.dsSetDocListID(listID);
	}

	docRefresh() {
		this.docService.dsSetDocListID(this.docList.listID);
		this.refreshEvent.emit();
	}	

	editModeChange() {
		this.editModeEvent.emit(this.docEditMode);
	}

	viewModeChange() {
		this.viewModeEvent.emit(this.viewMode);
	}
}

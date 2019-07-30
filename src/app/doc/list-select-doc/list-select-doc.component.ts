import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ListSelectComponent } from '../../shared/component/list-select/list-select.component';

@Component({
  selector: 'app-list-select-doc',
  templateUrl: './list-select-doc.component.html',
  styleUrls: ['./list-select-doc.component.css']
})
export class ListSelectDocComponent implements OnInit {

	@ViewChild('docList', {static: true}) docList: ListSelectComponent;
	@Output() selectedListEvent = new EventEmitter<number>();

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

	public newListID: number;


  constructor() { }

  ngOnInit() {
		this.docList.isReady$.subscribe(
			ready => {
				if ( ready ) {
					this.newListID = this.docList.list[0].idx;;
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
		this.newListID = listID;
	}

	confirmListID() {
		this.selectedListEvent.emit(this.newListID);
	}
}

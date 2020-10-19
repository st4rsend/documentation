import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ListSelectComponent } from '../../../shared/component/list-select/list-select.component';

@Component({
  selector: 'app-list-select-doc',
  templateUrl: './list-select-doc.component.html',
  styleUrls: ['./list-select-doc.component.css']
})
export class ListSelectDocComponent implements OnInit {

	@ViewChild('docList', {static: true}) docList: ListSelectComponent;
	@Input() docListID: string;
	@Output() selectedListEvent = new EventEmitter<{key: number, value: string}>();

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
					//console.log(this.docList.list.values().next());
					this.docList.listID = +this.docListID;
					//this.newListID = this.docList.list[0].idx;;
					//this.newListID = this.docList.values().next();;
				}
			});
  }

	docThemeChangeEvent(theme: {key: number, value: string}) {
		if ( theme.key == 0) {
			this.docList.RemoveFilter();
		}
		else {
			this.docList.SetFilter(this.docListFilter, String(theme.key));
		}
	}

	docListChangeEvent(list: {key: number, value: string}) {
		this.newListID = list.key;
	}

	confirmListID() {
		this.selectedListEvent.emit({
			key: this.newListID, 
			value: this.docList.list.get(this.newListID)
		});
	}
}

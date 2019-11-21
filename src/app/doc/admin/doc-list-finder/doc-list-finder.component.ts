import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SqlListService, ISqlList } from '../../../shared/service/sql-list.service';

@Component({
  selector: 'app-doc-list-finder',
  templateUrl: './doc-list-finder.component.html',
  styleUrls: ['./doc-list-finder.component.scss'],
	providers: [ SqlListService ],
})
export class DocListFinderComponent implements OnInit {

	@Output() docListFinderEvent = new EventEmitter<{key: number, value: string}>();

	public docThemes: Map<number, string>;
	public docThemeKey: string = 'theme';
	public docThemeTable: string = 'documentation_theme';
	public docThemeIDName: string = 'ID';
	public docThemeColumn: string = 'description';
	public docThemePosition: string = 'position';

	public docLists: Map<number, string>;
	public docListKey: string = 'list';
	public docListTable: string = 'documentation_list';
	public docListIDName: string = 'ID';
	public docListColumn = 'description';
	public docListPosition = 'position';
	public docListFilter = 'themeID';

	public themeKey: number =  0;
	public listKey: number = 0;

  constructor(
		private docListService: SqlListService,
		) { }

  ngOnInit() {
		this.docListService.InitListKey(
			this.docThemeKey,
			this.docThemeTable,
			this.docThemeIDName,
			this.docThemeColumn,
			this.docThemePosition);
		this.docThemes = this.docListService.GetMapKey(this.docThemeKey);
		this.docListService.InitListKey(
			this.docListKey,
			this.docListTable,
			this.docListIDName,
			this.docListColumn,
			this.docListPosition);
		this.docLists = this.docListService.GetMapKey(this.docListKey);
  }

	listChange() {
		this.docListFinderEvent.emit({key: +this.listKey, value: this.docLists.get(+this.listKey)});
	}

	themeChange() {
		if (this.themeKey == 0) {
			this.docListService.RemoveFilterKey(this.docListKey);
		} else if (this.themeKey == -1) {
			this.docListService.SetFilterKey(
				this.docListKey,
				this.docListFilter,
				"");
		} else {
			this.docListService.SetFilterKey(
				this.docListKey,
				this.docListFilter,
				this.themeKey.toString());
		}
		this.docLists = this.docListService.GetMapKey(this.docListKey);
		this.listKey = 0;
		this.listChange();
	}
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
import { DocList } from  '../../shared/model/doc';
import { SqlListService, ISqlList } from '../../shared/services/sql-list.service';

@Component({
  selector: 'app-menu-doc',
  templateUrl: './menu-doc.component.html',
  styleUrls: ['./menu-doc.component.css'],
	providers: [ SqlListService ],
})
export class MenuDocComponent implements OnInit {

	@Output() editModeEvent = new EventEmitter<boolean>();
	public docEditMode: boolean = false;
	public docListID: number = 1;
	@Output() viewModeEvent = new EventEmitter<string>();
	public viewMode: string = 'normal';

	public docListEditMode: boolean = false;
	public docListTable: string = 'documentation_list';
	public docListIDName: string = 'ID';
	public docListColumn = 'description';
	public docListPosition = 'position';

	public docLists: Array<ISqlList>;

  constructor(
		private docService: DocService,
		private docListService: SqlListService
	) { }

  ngOnInit() {
		this.docListService.InitList(
			this.docListTable,
			this.docListIDName,
			this.docListColumn,
			this.docListPosition);
		this.docLists = this.docListService.GetList();
		this.docService.dsSetDocListID(this.docListID);
		//this.docService.dsSetDocListID(this.docLists[0].idx);
  }

	docListChange() {
		this.docService.dsSetDocListID(this.docListID);
	}

	editModeChange() {
		this.editModeEvent.emit(this.docEditMode);
	}

	viewModeChange() {
		this.viewModeEvent.emit(this.viewMode);
	}

	docListEdit() {
		this.docListEditMode = !this.docListEditMode;
	}

	listCloseEvent(value: boolean) {
		this.docListEditMode = value;
	}
}

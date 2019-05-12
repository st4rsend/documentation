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
	@Output() docListIDEvent = new EventEmitter<number>();
	public docListID: number = 1;
	@Output() viewModeEvent = new EventEmitter<string>();
	public viewMode: string = 'normal';

	public docListEditMode: boolean = false;

	private channelID: number = 2;
	public docLists: Array<ISqlList>;

  constructor(
		private docService: DocService,
		private docListService: SqlListService
	) { }

  ngOnInit() {
		this.docService.setChannelID(this.channelID);
		this.docListService.InitList("documentation_list", "ID", "description");
		this.docLists = this.docListService.GetList();
		this.docListIDEvent.emit(this.docListID);
  }
	docListChange() {
		this.docListIDEvent.emit(this.docListID);
	}
	editModeChange() {
		this.editModeEvent.emit(this.docEditMode);
	}
	viewModeChange() {
		this.viewModeEvent.emit(this.viewMode);
	}
	docListEdit() {
		this.docListEditMode = !this.docListEditMode;
		if (this.docListEditMode) {
			console.log("launch doc list edit mode");
		} else {
			console.log("close doc list edit mode");
		}
	}
}

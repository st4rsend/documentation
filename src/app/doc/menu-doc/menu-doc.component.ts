import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
import { DocList } from  '../../shared/model/doc';

@Component({
  selector: 'app-menu-doc',
  templateUrl: './menu-doc.component.html',
  styleUrls: ['./menu-doc.component.css']
})
export class MenuDocComponent implements OnInit {

	@Output() editModeEvent = new EventEmitter<boolean>();
	private docEditMode: boolean = false;
	@Output() docListIDEvent = new EventEmitter<string>();
	private docListID: string = '1';
	@Output() viewModeEvent = new EventEmitter<string>();
	private viewMode: string = 'normal';

	private channelID: number = 2;

	private docLists: Array<DocList>;

  constructor(private docService: DocService) { }

  ngOnInit() {

		this.docService.setChannelID(this.channelID);
		this.docService.dsSQLQueryDocsList();
		this.docLists = this.docService.dsGetDocLists();
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
	
}

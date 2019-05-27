import { Component, OnInit } from '@angular/core';
import { SqlListService } from '../../shared/services/sql-list.service';

@Component({
  selector: 'app-mgmt-base',
  templateUrl: './mgmt-base.component.html',
  styleUrls: ['./mgmt-base.component.css'],
	providers: [ SqlListService ],
})
export class MgmtBaseComponent implements OnInit {

	public docListEditMode: boolean = false;
	public docListTable: string = 'documentation_list';
	public docListIDName: string = 'ID';
	public docListColumn = 'description';
	public docListPosition = 'position';

  constructor() { }

  ngOnInit() {
  }
	docListEdit(){
		this.docListEditMode = !this.docListEditMode;
	}
	listCloseEvent(value: boolean) {
		this.docListEditMode = value;
	}
}

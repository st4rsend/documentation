import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mgmt-base',
  templateUrl: './mgmt-base.component.html',
  styleUrls: ['./mgmt-base.component.scss'],
})
export class MgmtBaseComponent implements OnInit {

	public docListEditMode: boolean = false;
	public docListTable: string = 'documentation_list';
	public docListIDName: string = 'ID';
	public docListColumn = 'description';
	public docListPosition = 'position';

	public docThemeListEditMode: boolean = false;
	public docThemeListTable: string = 'documentation_theme';
	public docThemeListIDName: string = 'ID';
	public docThemeListColumn = 'description';
	public docThemeListPosition = 'position';

  constructor() { }

  ngOnInit() {
  }
	docListEdit(){
		this.docListEditMode = !this.docListEditMode;
	}
	docListCloseEvent(value: boolean) {
		this.docListEditMode = value;
	}
	docThemeListEdit(){
		this.docThemeListEditMode = !this.docThemeListEditMode;
	}
	docThemeListCloseEvent(value: boolean) {
		this.docThemeListEditMode = value;
	}
}

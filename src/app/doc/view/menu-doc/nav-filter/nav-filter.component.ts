import { Component, OnInit, ViewChild } from '@angular/core';

import { DocService } from '../../../service/doc.service';

import { ListSelectComponent } from '../../../../shared/component/list-select/list-select.component';


@Component({
  selector: 'app-nav-filter',
  templateUrl: './nav-filter.component.html',
  styleUrls: ['./nav-filter.component.css']
})
export class NavFilterComponent implements OnInit {

	@ViewChild('docList', {static: true}) docList: ListSelectComponent;

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

	public themeLabel = "Theme";
	public docLabel = "Doc";


  constructor(
		private docService: DocService,
	) { }

  ngOnInit(): void {
  }

	docThemeChange(evt: {key: number, value: string}) {
		if ( evt.key == 0) {
			this.docList.RemoveFilter();
		}
		else {
			this.docList.SetFilter(this.docListFilter, evt.key.toString());
		}
	}

	docListChange(evt: {key: number, value: string}) {
		this.docService.dsSetDocListID(evt.key);
	}
}
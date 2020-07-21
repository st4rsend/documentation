import { Component, OnInit, ViewChild } from '@angular/core';

import { DocService } from '../../../service/doc.service';

import { ListSelectComponent } from '../../../../shared/component/list-select/list-select.component';


@Component({
  selector: 'app-nav-filter',
  templateUrl: './nav-filter.component.html',
  styleUrls: ['./nav-filter.component.scss']
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

	public searchDepth: number = 3;

  constructor(
		private docService: DocService,
	) { }

  public ngOnInit(): void {
  }

	public docThemeChange(evt: {key: number, value: string}) {
		if ( evt.key == 0) {
			this.docList.RemoveFilter();
		}
		else {
			this.docList.SetFilter(this.docListFilter, evt.key.toString());
		}
	}

	public docListChange(evt: {key: number, value: string}) {
		if ( evt.key > 0) {
			this.docService.navigate(evt.key, evt.value);
		}
	}

	public setDepth() {
		this.docList.setDepth(this.searchDepth);
	}
}

import { Component, OnInit } from '@angular/core';
import { SqlListService, ISqlList } from '../../shared/services/sql-list.service';
import { DocService } from '../../shared/services/doc.service';
import { ArticleShort } from '../../shared/model/doc';

@Component({
  selector: 'app-mgmt-base',
  templateUrl: './mgmt-base.component.html',
  styleUrls: ['./mgmt-base.component.scss'],
	providers: [ SqlListService, DocService ],
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

	public docDisplayListEditMode: boolean = false;
	public docDisplayListTable: string = 'documentation_display';
	public docDisplayListIDName: string = 'ID';
	public docDisplayListColumn = 'display';
	public docDisplayListPosition = 'position';

	public docThemes: Array<ISqlList>;
	public docThemeKey: string = 'theme';
	public docThemeTable: string = 'documentation_theme';
	public docThemeIDName: string = 'ID';
	public docThemeColumn: string = 'description';
	public docThemePosition: string = 'position';
	public docLists: Array<ISqlList>;
	public docListKey: string = 'list';

	public themeID: number =  0;
	public listID: number = 0;

	public articlesShort: Array<ArticleShort>;
	public articleListID: number;


  constructor(
		private docListService: SqlListService,
		private docService: DocService) {
		this.docService.isReady$.subscribe(
			ready => {
				console.log("isReady: ", ready);
				this.articlesShort = this.docService.getArticlesShort(this.articleListID);
			});	 
	}

  ngOnInit() {

		this.docListService.InitListKey(
			this.docThemeKey,
			this.docThemeTable,
			this.docThemeIDName,
			this.docThemeColumn,
			this.docThemePosition);
		this.docThemes = this.docListService.GetListKey(this.docThemeKey);
		this.docListService.InitListKey(
			this.docListKey,
			this.docListTable,
			this.docListIDName,
			this.docListColumn,
			this.docListPosition);
		this.docLists = this.docListService.GetListKey(this.docListKey);
		console.log(this.docThemes, this.docLists);

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
	docDisplayListEdit(){
		this.docDisplayListEditMode = !this.docDisplayListEditMode;
	}
	docDisplayListCloseEvent(value: boolean) {
		this.docDisplayListEditMode = value;
	}
	themeChange() {
		console.log("theme: ", this.themeID);
	}
	listChange() {
		console.log("list: ", this.listID);
		this.docService.SelectArticlesShort(this.listID);
	}
}

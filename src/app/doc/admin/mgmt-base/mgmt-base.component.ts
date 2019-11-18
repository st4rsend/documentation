import { Component, OnInit,
	ViewChild,
	ViewContainerRef,
	ComponentFactoryResolver,
	ComponentRef,
	ComponentFactory, 
} from '@angular/core';
import { SqlListService, ISqlList } from '../../../shared/service/sql-list.service';
import { DocService } from '../../service/doc.service';
import { ArticleShort } from '../../model/doc';

import { EditItemDocComponent } from '../../view/edit-item-doc/edit-item-doc.component';

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
	public docListFilter = 'themeID';

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

	public docThemes: Map<string, string>;
	public docThemeKey: string = 'theme';
	public docThemeTable: string = 'documentation_theme';
	public docThemeIDName: string = 'ID';
	public docThemeColumn: string = 'description';
	public docThemePosition: string = 'position';
	public docLists: Map<string, string>;
	public docListKey: string = 'list';

	public listKey: string = "0";
	public themeKey: string =  "0";
	public themeTargetKey: string = "";
	public themeEdit: string = "Change theme";
	public themeEditFlag: boolean = false;

	public articlesShort: Array<ArticleShort>;
	public articleListID: number;

	public articleID: number;

	articleEditComponentRef: any;
	@ViewChild('articleEditContainer', { static: true, read: ViewContainerRef }) EditItemDocComponent: ViewContainerRef;

  constructor(
		private docListService: SqlListService,
		private docService: DocService,
		private resolver: ComponentFactoryResolver,) {
		this.docService.isReady$.subscribe(
			ready => {
				if (ready) {
					this.articlesShort = this.docService.getArticlesShort(this.articleListID);
				}
			});	 
	}

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

	themeEditChange() {
		this.themeEditFlag = !this.themeEditFlag;
		if(this.listKey == "0") {
			this.themeEditFlag = false;
		}
		if (this.themeEditFlag) {
			this.themeEdit="Cancel";
		} else {
			this.themeEdit="Change theme";
		}
	}

	themeChange() {
		if (this.themeKey == "0") {
			this.docListService.RemoveFilterKey(this.docListKey);
		} else if (this.themeKey == "-1") {
			this.docListService.SetFilterKey(
				this.docListKey,
				this.docListFilter,
				"");
		} else {
			this.docListService.SetFilterKey(
				this.docListKey,
				this.docListFilter,
				this.themeKey);
		}
		this.docLists = this.docListService.GetMapKey(this.docListKey);
		this.listKey = "0";
		this.themeEditChange();
		this.articlesShort = [];
	}

	listChange() {
		this.docService.SelectArticlesShort(this.listKey);
		this.themeEditFlag = false;
		this.themeEdit="Change theme";
	}

	articleChange() {
		console.log("selected articleListID: ", this.articleID);
	}

	themeTargetChange() {
		console.log("Target Theme: ", this.themeTargetKey);
	}

	moveListToTheme() {
		this.docService.SetListTheme(this.listKey, this.themeTargetKey);
	}

	delArticleFromList() {
		console.log ("Delete articleID: ", this.articleID, " from ListKey: ", this.listKey); 
	}

	addArticleToList() {
		console.log("Add articleID: ", this.articleID, " to lIst has yet to be selected");
	}

	articleEdit() {
		console.log("Editing article: ", this.articleID);
		this.EditItemDocComponent.clear();
		const factory = this.resolver.resolveComponentFactory(EditItemDocComponent);
		this.articleEditComponentRef = this.EditItemDocComponent.createComponent(factory);
		this.articleEditComponentRef.instance.itemDocIdx = this.articleID;
		this.articleEditComponentRef.instance.itemDocCloseEvent.subscribe(
			value => {
				 this.itemDocCloseEvent(value);
			});
	}

	itemDocCloseEvent(altered: boolean) {
		console.log("destroying");
		this.articleEditComponentRef.destroy();
	}
}

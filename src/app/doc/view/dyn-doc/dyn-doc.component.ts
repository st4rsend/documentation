import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DocService } from '../../service/doc.service';
import { Doc } from '../../model/doc';
import { GlobalService } from '../../../shared/service/global.service';

@Component({
  selector: 'app-dyn-doc',
  templateUrl: './dyn-doc.component.html',
  styleUrls: ['./dyn-doc.component.scss']
})

export class DynDocComponent implements OnInit {

	@Input() editMode: boolean;
	@Input() viewMode: string;

	private dynTable: Array<Doc>;
	public creating: boolean = false;

	public docListID: number;
	public docs: Array<Doc>;
	public selectedIndex: number;
	public viewHeight: string;
	public statusBarHeight: string;

  constructor(
			private docService: DocService, 
			private globalService: GlobalService,
			private router: Router,
			) {
	}

	ngOnInit() {
		this.docService.isReady$.subscribe(
			ready => {
				if ( ready ) {
					console.log("DocService READY");
					this.docs = this.docService.dsGetDocs();
					this.docListID = this.docService.getDocListID();
				}
			});
		this.globalService.statusLineCount$.subscribe(
			count => {
				this.statusBarHeight =  "calc(" + ( count ) + "em)";
				this.viewHeight =  "calc(100% - " + ( count ) + "em)";
			}
		);
	}

	itemDocCloseEvent(value: boolean) {
		this.creating = false;
		this.docService.refresh();
	}

	toBeRefreshed(evt: boolean) {
		this.docService.dsSQLQueryDocs();
	}


	activateList(evt: {key: number, value: string}) {
		this.docService.navigate(evt.key, evt.value);
	}

	drop(event: CdkDragDrop<string[]>) {
		// disactivated for feeling and conflicts with dragable edit
		this.swapItem(event.previousIndex, event.currentIndex);
	}

	swapItem(i: number, j: number) {
		this.docService.updateDocPosition(
			this.docListID,
			this.docs[i].idx,
			j);
		this.docService.updateDocPosition(
			this.docListID,
			this.docs[j].idx,
			i);
		this.toBeRefreshed(true);

	}

	public itemFocus(i: number) {
		this.selectedIndex = i;
		this.docService.emitArticleFocus();
	}

	public mouseEnter() {
		this.docService.mouseOverArticle();
	}

	moveUp(i: number) {
		if ((i > 0) && (this.docs.length > 1)) {
			this.swapItem(i,i-1);
		}
	}

	moveDown(i: number) {
		if ((i < this.docs.length-1 ) && (this.docs.length > 1)) {
			this.swapItem(i,i+1);
		}
	}

	removeFromList(i: number) {
		console.log ("TODO: Remove from list: ", i);
	}

	articleEditEvent(article: Doc){
		this.docService.articleEdit(article);
	}
}

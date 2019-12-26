import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DocService } from '../../service/doc.service';
import {Doc} from '../../model/doc';
import { GlobalService } from '../../../shared/service/global.service';


import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-dyn-doc',
  templateUrl: './dyn-doc.component.html',
  styleUrls: ['./dyn-doc.component.scss']
})
export class DynDocComponent implements OnChanges {

	@Input() editMode: boolean;
	@Input() viewMode: string;
	@Input() newItemTrigger: boolean;

	@ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

	private dynTable: Array<Doc>;
	public creating: boolean = false;

	public docListID: number;
	public docs: Array<Doc>;
	public selectedIndex: number;
	public newItemFlag: boolean;

	public statusBarHeight: string = "calc(100vh - 6em)";

  constructor(
			private docService: DocService, 
			private globalService: GlobalService) {
		this.docService.isReady$.subscribe(
			ready => {
				if ( ready ) {
					this.docs = this.docService.dsGetDocs();
					this.docListID = this.docService.getDocListID();
				}
			});
		this.globalService.statusLineCount$.subscribe(
			count => {
				this.statusBarHeight =  "calc(100vh - " + ( count + 5 ) +"em)";
				console.log("Status Bar height: ", this.statusBarHeight);
			}
		);
	}

  ngOnChanges() {
		if (this.newItemFlag != this.newItemTrigger) {
			this.creating = ! this.creating;
		}
  }

	private itemDocCloseEvent(value: boolean) {
		this.creating = false;
	}

	toBeRefreshed(evt: boolean) {
		this.docService.dsSQLQueryDocs();
	}

	activateList(evt: number) {
		this.docService.dsSetDocListID(evt);
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

	itemFocus(i: number) {
		this.selectedIndex = i;
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
		console.log ("Remove from list: ", i);
	}
}

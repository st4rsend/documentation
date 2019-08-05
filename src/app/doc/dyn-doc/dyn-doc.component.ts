import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DocService } from '../../shared/services/doc.service';
import {Doc} from '../../shared/model/doc';

@Component({
  selector: 'app-dyn-doc',
  templateUrl: './dyn-doc.component.html',
  styleUrls: ['./dyn-doc.component.scss']
})
export class DynDocComponent implements OnInit {

	@Input() editMode: boolean;
	@Input() viewMode: string;

	@ViewChild(CdkVirtualScrollViewport, {static: false}) viewport: CdkVirtualScrollViewport;

	private dynTable: Array<Doc>;
	public creating: boolean = false;

	public docListID: number;
	public docs: Array<Doc>;
	public selectedIndex: number;

  constructor(private docService: DocService) {
		this.docService.isReady$.subscribe(
			ready => {
				if ( ready ) {
					this.docs = this.docService.dsGetDocs();
					this.docListID = this.docService.getDocListID();
				}
			});
	}

  ngOnInit() {
  }

	public docCreateItem() {
		this.creating = ! this.creating;
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
		//this.viewport.scrollToIndex(i);
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

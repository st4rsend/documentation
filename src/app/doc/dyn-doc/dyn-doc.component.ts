import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

	private dynTable: Array<Doc>;
	public creating: boolean = false;

	public docListID: number;
	public docs: Array<Doc>;

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
		this.docService.updateDocPosition(
			this.docListID,
			this.docs[event.previousIndex].idx,
			event.currentIndex);
		this.docService.updateDocPosition(
			this.docListID,
			this.docs[event.currentIndex].idx,
			event.previousIndex);
		this.toBeRefreshed(true);
	}
}

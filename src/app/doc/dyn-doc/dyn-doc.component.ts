import { Component, OnInit, Input } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
import { Subscription } from 'rxjs';
import {Doc} from '../../shared/model/doc';

@Component({
  selector: 'app-dyn-doc',
  templateUrl: './dyn-doc.component.html',
  styleUrls: ['./dyn-doc.component.css']
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
}

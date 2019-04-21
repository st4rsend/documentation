import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
import { Doc, DocType } from '../../shared/model/doc';

@Component({
  selector: 'app-edit-item-doc',
  templateUrl: './edit-item-doc.component.html',
  styleUrls: ['./edit-item-doc.component.css']
})
export class EditItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Output() itemDocCloseEvent = new EventEmitter<boolean>();

	private docTypes: Array<DocType>;

  constructor(private docService: DocService) { }

  ngOnInit() {
		this.docService.dsSQLQueryDocTypes();
		this.docTypes = this.docService.dsGetDocTypes();
  }

	cancel() {
		this.itemDocCloseEvent.emit(false);
	}

	validate() {
		console.log("Doc Types:", this.docTypes);
	} 

}

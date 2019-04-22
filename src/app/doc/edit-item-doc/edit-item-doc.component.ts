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

	public doc: Doc;
	public docTypeID: number;

  constructor(private docService: DocService) { }

  ngOnInit() {
		this.docService.dsSQLQueryDocTypes();
		this.docTypes = this.docService.dsGetDocTypes();
		this.docTypeID = this.itemDoc.typeID;
		this.doc = { ...this.itemDoc};
  }

	cancel() {
		this.itemDocCloseEvent.emit(false);
	}
	validate() {
		console.log("doc: ", this.doc);
	} 
	docTypeChange() {
		this.doc.typeID = this.docTypeID;
		console.log("docTypeID: ", this.doc.typeID);
	}
	reset() {
		//console.log("itemDoc: ", this.itemDoc);
		//console.log("doc: ", this.doc);
		this.doc = { ...this.itemDoc};
		this.docTypeID = this.itemDoc.typeID;
	}

}

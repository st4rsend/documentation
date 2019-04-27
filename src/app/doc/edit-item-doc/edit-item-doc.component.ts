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
	@Input() docListID: string;
	@Output() itemDocCloseEvent = new EventEmitter<boolean>();

	private docTypes: Array<DocType>;

	private creation: boolean;
	public doc: Doc;
	public docTypeID: number;

  constructor(private docService: DocService) { }

  ngOnInit() {
		this.docService.dsSQLQueryDocTypes();
		this.docTypes = this.docService.dsGetDocTypes();
		this.reset();
  }

	cancel() {
		this.itemDocCloseEvent.emit(false);
	}
	validate() {
		if (this.doc.idx == 0){
			this.docService.dsInsertDoc(this.doc, this.docListID);
		} else {
			this.docService.dsUpdateDoc(this.doc);
		}
	} 
	docTypeChange() {
		this.doc.typeID = this.docTypeID;
	}
	reset() {
		if (this.itemDoc !=null){
			this.creation = false;
			this.docTypeID = this.itemDoc.typeID;
			this.doc = { ...this.itemDoc};
		} else {
			this.creation = true;
			this.doc = new Doc(0,1,"TEXT",0,"","");
			this.docTypeID = 1;
		}
	}
	fromFile(file) {
		var loader = new FileReader();
		console.log("FILE: ", file);
		loader.readAsText(file.target.files[0]);
		loader.onload = (e) => {
			this.doc.value = loader.result as string;
		}
	}

}

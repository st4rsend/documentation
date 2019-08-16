import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocService } from '../../shared/services/doc.service';
import { Doc, DocType } from '../../shared/model/doc';
import { SqlListService, ISqlList } from '../../shared/services/sql-list.service';

@Component({
  selector: 'app-edit-item-doc',
  templateUrl: './edit-item-doc.component.html',
  styleUrls: ['./edit-item-doc.component.scss'],
	providers: [ SqlListService ]
})
export class EditItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Output() itemDocCloseEvent = new EventEmitter<boolean>();

	public docTypes: Array<ISqlList>;
	public doctypeTable: string = 'documentation_type';
	public docTypeIDName: string = 'ID';
	public docTypeColumn: string = 'type';
	public docTypePosition: string = 'position';

	private creation: boolean;
	public doc: Doc;
	public docTypeID: number;
	public listTypeSelected: boolean;

	public editStyles;


  constructor(
		private docService: DocService,
		private docTypeListService: SqlListService) {
			console.log("CREATING edit-item-doc");
		}

  ngOnInit() {
		this.docTypeListService.InitList(
			this.doctypeTable,
			this.docTypeIDName,
			this.docTypeColumn,
			this.docTypePosition);
		this.docTypes = this.docTypeListService.GetList();
		this.reset();
		
		if (this.doc.typeID == 4) {
			this.listTypeSelected = true;
		} else {
			this.listTypeSelected = false;
		}
		this.editStyles = {
			"left": "50px",
			"width": "400px",
			"height": "300px"
		};
  }

	cancel() {
		this.itemDocCloseEvent.emit(false);
	}

	validate() {
		if (this.doc.idx == 0){
			this.docService.dsInsertDoc(this.doc);
		} else {
			this.docService.dsUpdateDoc(this.doc);
		}
		this.cancel();
	} 

	docTypeChange() {
		this.doc.typeID = this.docTypeID;
		if (this.docTypeID == 4) {
			this.listTypeSelected = true;
		} else {
			this.listTypeSelected = false;
		}
	}

	selectedListEvent(listID: number) {
		this.doc.childListID = listID;
	}

	reset() {
		if (this.itemDoc !=null){
			this.creation = false;
			this.docTypeID = this.itemDoc.typeID;
			this.doc = { ...this.itemDoc};
		} else {
			this.creation = true;
			this.doc = new Doc(0, 1, "TEXT", 0, "", "", 0);
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

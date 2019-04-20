import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Doc } from '../../shared/model/doc';

@Component({
  selector: 'app-edit-item-doc',
  templateUrl: './edit-item-doc.component.html',
  styleUrls: ['./edit-item-doc.component.css']
})
export class EditItemDocComponent implements OnInit {

	//@Input() htmlValue: string;
	@Input() itemDoc: Doc;
	@Output() itemDocCloseEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

	cancel() {
		this.itemDocCloseEvent.emit(false);
	}

}

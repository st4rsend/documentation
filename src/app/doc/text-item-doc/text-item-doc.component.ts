import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Doc } from '../../shared/model/doc';

@Component({
  selector: 'app-text-item-doc',
  templateUrl: './text-item-doc.component.html',
  styleUrls: ['./text-item-doc.component.scss']
})
export class TextItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Input() editMode: boolean;
	@Input() viewMode: string;
	@Output() changedEvent = new EventEmitter<boolean>();

	public editing: boolean = false;

  constructor() { }

  ngOnInit() {
  }

	edit() {
		this.editing = !this.editing;
	}

	itemDocCloseEvent(value: boolean) {
		this.editing = false;
		this.changedEvent.emit(true);
	}
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

import { Doc } from '../../model/doc';


@Component({
  selector: 'app-list-item-doc',
  templateUrl: './list-item-doc.component.html',
  styleUrls: ['./list-item-doc.component.scss']
})
export class ListItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Input() editMode: boolean;
	@Input() viewMode: string;
	@Output() changedEvent = new EventEmitter<boolean>();
	@Output() activateListEvent = new EventEmitter<{key: number, value: string}>();

	private editing: boolean = false;

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

	activateChildList(value: string, description: string) {
		this.activateListEvent.emit({key: parseInt(value), value: description});
	}
}

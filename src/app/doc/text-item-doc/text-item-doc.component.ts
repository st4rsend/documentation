import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import {PortalModule, ComponentPortal} from '@angular/cdk/portal';

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
	@Output() activateListEvent = new EventEmitter<number>();

	public editing: boolean = false;

  constructor() {}

  ngOnInit() {
		//console.log("itemDoc:", this.itemDoc);
  }

	edit() {
		this.editing = !this.editing;
	}

	itemDocCloseEvent(altered: boolean) {
		this.editing = false;
		if (altered) {
			this.changedEvent.emit(true);
		}
	}

	activateChildList(value: string) {
		this.activateListEvent.emit(parseInt(value));
	}
}


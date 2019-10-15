import { Component, OnChanges, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import {PortalModule, ComponentPortal} from '@angular/cdk/portal';

import { Doc } from '../../shared/model/doc';


@Component({
  selector: 'app-text-item-doc',
  templateUrl: './text-item-doc.component.html',
  styleUrls: ['./text-item-doc.component.scss']
})
export class TextItemDocComponent implements OnChanges {

	@Input() itemDoc: Doc;
	@Input() editMode: boolean;
	@Input() viewMode: string;
	@Output() changedEvent = new EventEmitter<boolean>();
	@Output() activateListEvent = new EventEmitter<number>();

	public editing: boolean = false;
	public displayDirCss: string;
	public displaySplitCssA: string;
	public displaySplitCssB: string;

  constructor() {}

	ngOnChanges() {
		if (this.itemDoc.display === "Row-50") {
			this.displayDirCss = "row";
			this.displaySplitCssA = "row-50-left";
			this.displaySplitCssB = "row-right";
		}
		if (this.itemDoc.display === "Row-33") {
			this.displayDirCss = "row";
			this.displaySplitCssA = "row-33-left";
			this.displaySplitCssB = "row-right";
		}
		if (this.itemDoc.display === "Row-66") {
			this.displayDirCss = "row";
			this.displaySplitCssA = "row-66-left";
			this.displaySplitCssB = "row-right";
		}
		if (this.itemDoc.display === "Column") {
			this.displayDirCss = "column";
			this.displaySplitCssA = "column-top";
			this.displaySplitCssB = "column-bottom";
		}
		if (this.itemDoc.display === "Solo") {
			this.displayDirCss = "Column";
			this.displaySplitCssA = "column-solo";
			this.displaySplitCssB = "column-solo";
		}
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


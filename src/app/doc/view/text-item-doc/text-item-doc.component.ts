import { Component, OnChanges, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import {PortalModule, ComponentPortal} from '@angular/cdk/portal';

import { Doc } from '../../model/doc';
import { DocService } from '../../service/doc.service';


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
	@Output() activateListEvent = new EventEmitter<{key: number, value: string}>();

	public displayDirCss: string;
	public displaySplitCssA: string;
	public displaySplitCssB: string;
	public inner: string = "inner"
	public latex: string = "latex"
	public mathml: string = "mathml"

  constructor(
		private docService: DocService,
	) {}

	ngOnChanges() {
		if (this.itemDoc.display === "Row-50") {
			this.displayDirCss = "row";
			this.displaySplitCssA = "row-50-left";
			this.displaySplitCssB = "row-50-right";
		}
		if (this.itemDoc.display === "Row-33") {
			this.displayDirCss = "row";
			this.displaySplitCssA = "row-33-left";
			this.displaySplitCssB = "row-33-right";
		}
		if (this.itemDoc.display === "Row-66") {
			this.displayDirCss = "row";
			this.displaySplitCssA = "row-66-left";
			this.displaySplitCssB = "row-66-right";
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
		this.docService.articleEdit(this.itemDoc);
	}

	activateChildList(value: string, description: string, $event) {
		$event.stopPropagation();
		this.activateListEvent.emit({key: parseInt(value), value: description});
	}
}


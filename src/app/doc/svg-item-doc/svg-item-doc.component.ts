import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Doc } from '../../shared/model/doc';

@Component({
  selector: 'app-svg-item-doc',
  templateUrl: './svg-item-doc.component.html',
  styleUrls: ['./svg-item-doc.component.css',
		'../dyn-doc/dyn-doc.component.scss']
})
export class SvgItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Input() editMode: boolean;
	@Input() viewMode: string;
	@Output() changedEvent = new EventEmitter<boolean>();

	private editing: boolean = false;

	svg:SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
		this.svg = this.sanitizer.bypassSecurityTrustHtml(this.itemDoc.value);
  }

	edit() {
		this.editing = !this.editing;
	}

	itemDocCloseEvent(value: boolean) {
		this.editing = false;
		this.changedEvent.emit(true);
	}
}

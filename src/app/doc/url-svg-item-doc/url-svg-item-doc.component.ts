import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Doc } from '../../shared/model/doc';

@Component({
  selector: 'app-url-svg-item-doc',
  templateUrl: './url-svg-item-doc.component.html',
  styleUrls: ['./url-svg-item-doc.component.css',
		'../dyn-doc/dyn-doc.component.css']
})
export class UrlSvgItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Input() editMode: boolean;
	@Input() viewMode: string;
	@Output() changedEvent = new EventEmitter<boolean>();

	private editing: boolean = false;

	svg: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
		this.svg=this.sanitizer.bypassSecurityTrustResourceUrl(this.itemDoc.value);
  }

	edit() {
		this.editing = !this.editing;
	}
	itemDocCloseEvent(value: boolean) {
		this.editing = false;
		this.changedEvent.emit(true);
	}
}

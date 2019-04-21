import { Component, OnInit, Input } from '@angular/core';
import { Doc } from '../../shared/model/doc';

@Component({
  selector: 'app-text-item-doc',
  templateUrl: './text-item-doc.component.html',
  styleUrls: ['./text-item-doc.component.css',
		'../dyn-doc/dyn-doc.component.css']
})
export class TextItemDocComponent implements OnInit {

	@Input() itemDoc: Doc;
	@Input() editMode: boolean;
	@Input() viewMode: string;

	private editing: boolean = false;

  constructor() { }

  ngOnInit() {
		console.log("View Mode: ",this.viewMode);
  }

	edit() {
		this.editing = !this.editing;
	}

	itemDocCloseEvent(value: boolean) {
		this.editing = false;
	}
}

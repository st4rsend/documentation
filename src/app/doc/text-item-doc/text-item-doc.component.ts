import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-item-doc',
  templateUrl: './text-item-doc.component.html',
  styleUrls: ['./text-item-doc.component.css']
})
export class TextItemDocComponent implements OnInit {

	@Input() htmlValue: string;
	@Input() editMode: boolean;

	private editing: boolean = false;

  constructor() { }

  ngOnInit() {
  }

	edit() {
		this.editing = !this.editing;
		console.log("Editing: ", this.editing);
	}

	itemDocCloseEvent(value: boolean) {
		this.editing = false;
	}
}

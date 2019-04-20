import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-item-doc',
  templateUrl: './edit-item-doc.component.html',
  styleUrls: ['./edit-item-doc.component.css']
})
export class EditItemDocComponent implements OnInit {

	@Input() htmlValue: string;
	@Output() itemDocCloseEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

	cancel() {
		this.itemDocCloseEvent.emit(false);
	}

}

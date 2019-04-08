import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-doc',
  templateUrl: './menu-doc.component.html',
  styleUrls: ['./menu-doc.component.css']
})
export class MenuDocComponent implements OnInit {

	@Output() editModeEvent = new EventEmitter<boolean>();
	private docEditMode: boolean = false;

  constructor() { }

  ngOnInit() {
  }

	editModeChange() {
		this.editModeEvent.emit(this.docEditMode);
	}

}

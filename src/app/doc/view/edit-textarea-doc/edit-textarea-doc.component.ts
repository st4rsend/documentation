import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-textarea-doc',
  templateUrl: './edit-textarea-doc.component.html',
  styleUrls: ['./edit-textarea-doc.component.scss']
})
export class EditTextareaDocComponent implements OnInit {

	@Input() text: string;
	@Output() textareaCloseEvent = new EventEmitter<string>();

	newText: string;

  constructor() { }

  ngOnInit(): void {
		this.newText = this.text;
  }

	validate() {
		this.textareaCloseEvent.emit(this.newText);
	}

	cancel() {
		this.textareaCloseEvent.emit(undefined);
	}
	refresh() {
		this.newText = this.text;
	}

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.css']
})
export class InputBoxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

	@Input() inputPlaceholder: string;
	@Input() buttonLabel: string;

	@Output() inputText = new EventEmitter<string>();

	emitText(text: string) {
		this.inputText.emit(text);
	}
	
}

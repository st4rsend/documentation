import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-text-item-doc',
  templateUrl: './text-item-doc.component.html',
  styleUrls: ['./text-item-doc.component.css']
})
export class TextItemDocComponent implements OnInit {

	@Input() htmlValue: string;
	@Input() editMode: boolean;

  constructor() { }

  ngOnInit() {
  }

}

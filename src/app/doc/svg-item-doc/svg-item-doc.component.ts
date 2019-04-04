import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-svg-item-doc',
  templateUrl: './svg-item-doc.component.html',
  styleUrls: ['./svg-item-doc.component.css']
})
export class SvgItemDocComponent implements OnInit {

	@Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}

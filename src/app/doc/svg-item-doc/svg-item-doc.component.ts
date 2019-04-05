import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-item-doc',
  templateUrl: './svg-item-doc.component.html',
  styleUrls: ['./svg-item-doc.component.css']
})
export class SvgItemDocComponent implements OnInit {

	@Input() text: string;
	svg:SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
		this.svg = this.sanitizer.bypassSecurityTrustHtml(this.text);
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-url-svg-item-doc',
  templateUrl: './url-svg-item-doc.component.html',
  styleUrls: ['./url-svg-item-doc.component.scss']
})
export class UrlSvgItemDocComponent implements OnInit {

	@Input() data: string;

	svg: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
		this.svg=this.sanitizer.bypassSecurityTrustResourceUrl(this.data);
  }
}

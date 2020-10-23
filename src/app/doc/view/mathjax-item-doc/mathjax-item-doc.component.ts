import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MathContent } from '../../../shared/mathjax/math-content';

@Component({
  selector: 'app-mathjax-item-doc',
  templateUrl: './mathjax-item-doc.component.html',
  styleUrls: ['./mathjax-item-doc.component.css']
})
export class MathjaxItemDocComponent implements OnInit {

	@Input() data: string;
	@Input() pres: string;

	mathjax:SafeHtml;
	mathjaxLatex : MathContent;
	mathjaxMathml : MathContent;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
		this.mathjax = this.sanitizer.bypassSecurityTrustHtml(this.data);
		this.mathjaxLatex = {
    	latex: this.data
  	};
		this.mathjaxMathml = {
    	mathml: this.data
  	};
	
  }


}

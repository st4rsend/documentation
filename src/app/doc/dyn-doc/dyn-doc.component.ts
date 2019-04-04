import { Component, OnInit } from '@angular/core';
import {Doc} from '../../shared/model/doc';

@Component({
  selector: 'app-dyn-doc',
  templateUrl: './dyn-doc.component.html',
  styleUrls: ['./dyn-doc.component.css']
})
export class DynDocComponent implements OnInit {

	private testTexte="Hello World";
	private dynTable: Array<Doc>;

  constructor() {
	}

  ngOnInit() {
		this.dynTable = [
			{idx:1,typeID:1,typeValue:'TEXT',position:1,value:'TEXTE 1'},
			{idx:2,typeID:1,typeValue:'TEXT',position:2,value:'TEXTE 2'},
			{idx:3,typeID:1,typeValue:'TEXT',position:3,value:'TEXTE 3'},
			{idx:4,typeID:2,typeValue:'SVG',position:4,value:'SVG 1'},
		];
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-mgmt',
  templateUrl: './list-mgmt.component.html',
  styleUrls: ['./list-mgmt.component.css']
})
export class ListMgmtComponent implements OnInit {

	@Input() table: string;
	@Input() index: string;
	@Input() column: string;

  constructor() { }

  ngOnInit() {
		console.log("Table: ", this.table, " ; index: ", this.index, " ; column: ", this.column);
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SqlListService, ISqlList } from '../../services/sql-list.service';

@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.css'],
	providers: [ SqlListService ],
})
export class ListSelectComponent implements OnInit {
	@Output() listChangeEvent = new EventEmitter<number>();
	@Input() listTable: string;
	@Input() listIDName: string;
	@Input() listColumn: string;
	@Input() listPosition: string;
	public list: Array<ISqlList>;
	public listID: number = 1;

  constructor( private sqlListService: SqlListService) { }

  ngOnInit() {
		this.sqlListService.InitList(
			this.listTable,
			this.listIDName,
			this.listColumn,
			this.listPosition);
		this.list = this.sqlListService.GetList();
  }

	listChange() {
		this.listChangeEvent.emit(this.listID);
	}

}

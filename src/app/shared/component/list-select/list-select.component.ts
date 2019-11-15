import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { SqlListService, ISqlList } from '../../service/sql-list.service';

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
	@Input() hasVoid: boolean;
	public list: Array<ISqlList>;
	public listID: number;
	public isReady$ = new Subject<boolean>();

  constructor( private sqlListService: SqlListService) { }

  ngOnInit() {
		this.sqlListService.isReady$.subscribe(
			ready => {
				if (ready && (this.list[0] != undefined)) {
					this.listID = this.list[0].idx;
				}
				this.isReady$.next(ready);
		});
		this.initList();
  }

	SetFilter(column: string, value: string){
		this.sqlListService.SetFilter(column, value);
		this.getList();
		
	}
	RemoveFilter(){
		this.sqlListService.RemoveFilter();
		this.getList();
	}

	listChange() {
		this.listChangeEvent.emit(this.listID);
	}

	getList() {
		this.list = this.sqlListService.GetList();
		if (this.hasVoid) {
			this.list.unshift({
				idx: 0,
				value: "--- select ---",
				position: 0,
			});
		}
	}

	initList() {
		this.sqlListService.InitList(
			this.listTable,
			this.listIDName,
			this.listColumn,
			this.listPosition);
		this.getList();
	}
}

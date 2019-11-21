import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { SqlListService, ISqlList } from '../../service/sql-list.service';

@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss'],
	providers: [ SqlListService ],
})
export class ListSelectComponent implements OnInit {
//	@Output() listChangeEvent = new EventEmitter<number>();
	@Output() listChangeEvent = new EventEmitter<{key: number, value: string}>();
	@Input() listTable: string;
	@Input() listIDName: string;
	@Input() listColumn: string;
	@Input() listPosition: string;
	@Input() hasVoid: boolean;
	//public list: Array<ISqlList>;
	public list: Map<number, string>;
	public listID: number;
	public isReady$ = new Subject<boolean>();

  constructor( private sqlListService: SqlListService) { }

  ngOnInit() {
		this.sqlListService.isReady$.subscribe(
			ready => {
				if (ready && (this.list[0] != undefined)) {
					console.log("hello: ", ready, " this.list: ", this.list);
					this.listID = this.list[0].idx;
					this.listChange();
					this.isReady$.next(ready);
				}
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
		this.listChangeEvent.emit({key: this.listID, value: this.list.get(this.listID)});
	}

	getList() {
		this.list = this.sqlListService.GetMap();
		/*
		if (this.hasVoid) {
			this.list.unshift({
				idx: 0,
				value: "--- select ---",
				position: 0,
			});
		}
		*/
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

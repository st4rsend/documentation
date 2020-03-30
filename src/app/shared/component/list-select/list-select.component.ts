import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { SqlListService, ISqlList } from '../../service/sql-list.service';

@Component({
  selector: 'app-list-select',
  templateUrl: './list-select.component.html',
  styleUrls: ['./list-select.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [ SqlListService ],
})
export class ListSelectComponent implements OnInit {
	@Output() listChangeEvent = new EventEmitter<{key: number, value: string}>();
	@Input() label: string;
	@Input() listTable: string;
	@Input() listIDName: string;
	@Input() listColumn: string;
	@Input() listPosition: string;
	@Input() hasVoid: boolean;
	public list: Map<number, string>;
	public listID: number;
	public isReady$ = new Subject<boolean>();

  constructor( private sqlListService: SqlListService) { }

  ngOnInit() {
		this.sqlListService.isReady$.subscribe(
			ready => {
				if (ready && (this.list != undefined) && !this.hasVoid) {
					this.listID = this.list.entries().next().value[0];
					this.listChange();
				}
				this.isReady$.next(ready);
		});
		this.initList();
  }

	// for *ngFor presentation:
	// The pipe keyvalue reorders the map.
	// Hence to be overriden.
	preserveMapOrder(a, b) {
		return 1;
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
		this.listChangeEvent.emit({key: this.listID, value: this.list.get(+this.listID)});
	}

	getList() {
		this.list = this.sqlListService.GetMap();
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

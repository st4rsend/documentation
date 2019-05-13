import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SqlListService, ISqlList } from '../../services/sql-list.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-mgmt',
  templateUrl: './list-mgmt.component.html',
  styleUrls: ['./list-mgmt.component.scss']
})
export class ListMgmtComponent implements OnInit {

	@Input() table: string;
	@Input() index: string;
	@Input() column: string;
	@Output() listCloseEvent = new EventEmitter<boolean>();

	public newList: Array<ISqlList>;
	public list: Array<ISqlList>;

  constructor( private listService: SqlListService ) { }

  ngOnInit() {
		console.log("Table: ", this.table, " ; ", this.index, " ; ", this.column);
		this.listService.InitList(this.table, this.index, this.column);
		this.list = this.listService.GetList();
		this.newList = this.list.slice();
		console.log(this.newList);
  }
	newItem() {
		this.newList.push({id: 0, value: ""});
	}
	validate() {
		console.log("list: ", this.list);
		console.log("newList: ", this.newList);
	}
	reset() {
		this.listService.InitList(this.table, this.index, this.column);
		this.list = this.listService.GetList();
		this.newList = this.list.slice();
	}
	cancel() {
		this.listCloseEvent.emit(false);
	}
	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.newList, event.previousIndex, event.currentIndex);
	}
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
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

	public isReady: Subscription;

  constructor( private listService: SqlListService ) { 

	}

  ngOnInit() {
		this.isReady = this.listService.isReady$.subscribe( (value) => { this.listReady( value); });
		this.listService.InitList(this.table, this.index, this.column);
  }
	listReady(value: boolean) {
		if ( value == true ) {
			this.list = this.listService.GetList();
			this.newList = this.list.map(e => ({ ... e }));
		}
		else {
			this.list = [];
		}
	}

	newItem() {
		this.newList.push({id: 0, value: "", position: 0});
	}

	validate() {
		console.log("list: ", this.list);
		console.log("newList: ", this.newList);
		for ( let item in this.newList ) {
			if ( this.newList[item].id != this.list[item].id ) {
				console.log("Update position lnd value ist id ", this.newList[item].id, " to position", this.list[item].position," and value", this.newList[item].value); 
			} else {
				if (  this.newList[item].value != this.list[item].value ) {
					console.log ("Update value of ", this.newList[item].id, " to ", this.newList[item].value);
				}
			}
		}
	}

	reset() {
		this.listService.InitList(this.table, this.index, this.column);
	}
	cancel() {
		this.listCloseEvent.emit(false);
	}
	drop(event: CdkDragDrop<string[]>) {
		console.log("previousIndex: ", event.previousIndex);
		console.log("currentIndex: ", event.currentIndex);
		moveItemInArray(this.newList, event.previousIndex, event.currentIndex);
	}
}

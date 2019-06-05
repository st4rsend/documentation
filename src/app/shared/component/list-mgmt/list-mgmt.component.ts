import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SqlListService, ISqlList } from '../../services/sql-list.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-mgmt',
  templateUrl: './list-mgmt.component.html',
  styleUrls: ['./list-mgmt.component.scss'],
	providers: [ SqlListService ],
})
export class ListMgmtComponent implements OnInit {

	@Input() table: string;
	@Input() index: string;
	@Input() column: string;
	@Input() position: string;
	@Output() listCloseEvent = new EventEmitter<boolean>();

	public deleteMode: boolean = false;

	public newList: Array<ISqlList>;
	public list: Array<ISqlList>;

	public isReady: Subscription;

  constructor( private listService: SqlListService ) { 

	}

	allowDelete() {
		this.deleteMode = !this.deleteMode;
	}

  ngOnInit() {
		this.isReady = this.listService.isReady$.subscribe( (value) => { this.listReady( value); });
		this.listService.InitList(this.table, this.index, this.column, this.position);
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
		this.newList.push({idx: 0, value: "", position: 0});
	}

	deleteItem(idx: number) {
		this.listService.DeleteItem(idx);
		this.listService.InitList(this.table, this.index, this.column, this.position);
	}


	validate() {
		this.listService.UpdateList(this.newList);
		this.listService.InitList(this.table, this.index, this.column, this.position);
	}

	reset() {
		this.listService.InitList(this.table, this.index, this.column, this.position);
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

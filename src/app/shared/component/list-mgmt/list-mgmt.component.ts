import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { SqlListService, ISqlList } from '../../service/sql-list.service';
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

	public allowDelete() {
		this.deleteMode = !this.deleteMode;
	}

  public ngOnInit() {
		this.isReady = this.listService.isReady$.subscribe( 
			(value) => {
				this.listReady( value);
			});
		this.listService.InitList(this.table, this.index, this.column, this.position);
  }

	public listReady(value: boolean) {
		if ( value == true ) {
			this.list = this.listService.GetList();
			this.newList = this.list.map(e => ({ ... e }));
		}
		else {
			this.list = [];
		}
	}

	public newItem() {
		this.newList.push({idx: 0, value: "", position: 0, humanRating: 0, calcRating: 0});
	}

	public deleteItem(idx: number) {
		this.listService.DeleteItem(idx);
		this.listService.InitList(this.table, this.index, this.column, this.position);
	}


	public validate() {
		this.listService.UpdateList(this.newList);
		this.listService.InitList(this.table, this.index, this.column, this.position);
	}

	public reset() {
		this.listService.InitList(this.table, this.index, this.column, this.position);
	}
	public cancel() {
		this.listCloseEvent.emit(false);
	}
	public drop(event: CdkDragDrop<string[]>) {
		//console.log("previousIndex: ", event.previousIndex);
		//console.log("currentIndex: ", event.currentIndex);
		moveItemInArray(this.newList, event.previousIndex, event.currentIndex);
	}
}

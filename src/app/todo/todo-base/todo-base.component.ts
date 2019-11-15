import { Component, OnInit, EventEmitter } from '@angular/core';

import { ListTodoComponent } from '../list-todo/list-todo.component';
import { CreateTodoComponent } from '../create-todo/create-todo.component';
import { UpdateTodoComponent } from '../update-todo/update-todo.component';

import {TodoService} from '../../shared/service/todo.service';

@Component({
  selector: 'app-todo-base',
  templateUrl: './todo-base.component.html',
  styleUrls: ['./todo-base.component.scss'],
	providers: [ TodoService ],
})
export class TodoBaseComponent implements OnInit {

	//@Output() updateRequest = new EventEmitter<number>();
	public channelID: number = 1;

	public isListMode: boolean;
	public isCreateMode: boolean;
	public isUpdateMode: boolean;
	public updateIdx: number;

  constructor( private todoService: TodoService	){}

  ngOnInit() {
		this.activateList();
  }
	activateList() {
		this.isUpdateMode =  false;
		this.isCreateMode =  false;
		this.isListMode = true;
	}
	activateCreate() {
		this.isUpdateMode =  false;
		this.isListMode = false;
		this.isCreateMode =  true;
	}
	activateUpdate(idx: number) {
		this.updateIdx = idx;
		this.isCreateMode =  false;
		this.isListMode = false;
		this.isUpdateMode =  true;
	}
	updateRequest(idx: number) {
		this.activateUpdate(idx);
	}
}

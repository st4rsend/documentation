import { Component, OnInit } from '@angular/core';

import { ListTodoComponent } from '../list-todo/list-todo.component';
import { CreateTodoComponent } from '../create-todo/create-todo.component';
import { UpdateTodoComponent } from '../update-todo/update-todo.component';


@Component({
  selector: 'app-todo-base',
  templateUrl: './todo-base.component.html',
  styleUrls: ['./todo-base.component.css']
})
export class TodoBaseComponent implements OnInit {

	public isListMode: boolean;
	public isCreateMode: boolean;
	public isUpdateMode: boolean;

  constructor() { }

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
		this.isCreateMode =  true;
		this.isListMode = false;
	}

	activateUpdate(idx: number) {
		this.isUpdateMode =  true;
		this.isCreateMode =  false;
		this.isListMode = false;
	}
}

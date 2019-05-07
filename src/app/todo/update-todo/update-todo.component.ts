import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';


import { TodoService } from '../../shared/services/todo.service';
import { SqlListService, ISqlList } from '../../shared/services/sql-list.service';
import { Todo } from '../../shared/model/todo';

@Component({
  selector: 'app-update-todo',
  templateUrl: './update-todo.component.html',
  styleUrls: ['./update-todo.component.css'],
	providers: [ SqlListService ],
})

export class UpdateTodoComponent implements OnInit {

	@Input() channelID: number;
	@Input() idx: number;
	@Output() 
	activateList = new EventEmitter();

	public todo: Todo;
	public userList: Array<ISqlList> = [];

	public user: string;
	public label: string;
	public targetDate: string;
	public doneDate: string;
	public completed: string;
	
	public todoForm: FormGroup = new FormGroup({
		todoIDControl: new FormControl(null),
		todoUserControl: new FormControl(null),
		todoLabelControl: new FormControl(null),
		todoTargetDateControl: new FormControl(null),
		todoDoneDateControl: new FormControl(null),
		todoCompletedControl: new FormControl(null)
	});

  constructor(
		private todoService: TodoService, 
		private userListService: SqlListService,
	) {}

  ngOnInit() {
		this.todoService.setChannelID(this.channelID);
		this.userListService.InitList("users","ID","identity");
		this.userList = this.userListService.GetList();
		this.populate();
  }

	populate() {
		this.todo = this.todoService.getTodo(this.idx);
		this.todoForm.patchValue({
			todoIDControl: this.todo.idx,
			todoUserControl: this.todo.userID,
			todoLabelControl: this.todo.label,
			todoTargetDateControl: this.todo.targetDate,
			todoDoneDateControl: this.todo.doneDate,
			todoCompletedControl: this.todo.completed
		});
	}

	compare(val1, val2) {
		return val1 === val2;
	}

	onRefresh() {
		this.todoService.SQLSynchro();
	}
	validate() {
		this.todo.userID = this.todoForm.value["todoUserControl"];
		this.todo.label = this.todoForm.value["todoLabelControl"];
		this.todo.targetDate = this.todoForm.value["todoTargetDateControl"];
		this.todo.doneDate = this.todoForm.value["todoDoneDateControl"];
		this.todo.completed = this.todoForm.value["todoCompletedControl"];
		this.todoService.updateTodo(this.todo);
		this.activateList.emit();
	}
}

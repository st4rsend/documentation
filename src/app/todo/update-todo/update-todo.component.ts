import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


import { TodoService } from '../../shared/services/todo.service';
import { SqlListService, sqlList } from '../../shared/services/sql-list.service';
import { Todo } from '../../shared/model/todo';

@Component({
  selector: 'app-update-todo',
  templateUrl: './update-todo.component.html',
  styleUrls: ['./update-todo.component.css'],
	providers: [ TodoService, SqlListService ],
})
export class UpdateTodoComponent implements OnInit {

	public todo: Todo;
	private userList: sqlList[]=[];
	
	public isReadySub: Subscription;
	public isReady: boolean;

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
		private route: ActivatedRoute,
	) {}


  ngOnInit() {
		this.userList = this.userListService.getUsers();
		this.todoService.SQLSynchro();
		this.isReadySub = this.todoService.isReady$.subscribe(x => {
			this.isReady = x;
			if (this.isReady) {
				this.populate();
			}
		});
  }

	populate() {
		this.todo = this.todoService.getTodo(+this.route.snapshot.paramMap.get('idx'));
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
	onSubmit() {
		console.log("Submitting form");
	}
	emitTodo(todo: Todo) {
		//this.todoService.updateTodo(todo);
	}

}

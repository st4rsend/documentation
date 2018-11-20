import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


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
	//public todos: Array<Todo>;
	private userList: sqlList[]=[];

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
		this.userList = this.userListService.getUsers();
		this.todoService.SQLSynchro();
		//this.todos = this.todoService.getTodos();

  }


	onSubmit() {
		this.todo = this.todoService.getTodo(52);
		console.log(this.todo);
		console.log("Submitting form");
	}
	emitTodo(todo: Todo) {
		//this.todoService.updateTodo(todo);
	}

}

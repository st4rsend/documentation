import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../shared/services/todo.service';
import { Todo } from '../../shared/model/todo';


@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

	public todo: Todo;
	private userList = [[null,'Global'],[1,'User 1'],[3,'User 2'],[4,'User 3']];

  constructor( private todoService: TodoService ) { 
		this.todo = new Todo(null,null,'label',null,null,false);
	}

  ngOnInit() {
  }

	@Input() inputPlaceholder: string;
	@Input() buttonLabel: string;

	@Output() createTodo = new EventEmitter<Todo>();

	emitTodo(todo: Todo) {
//		this.createTodo.emit(todo);
		this.todoService.createTodo(todo);
	}
}

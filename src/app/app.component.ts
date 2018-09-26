import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { TodoService } from './shared/services/todo.service'
import { Todo } from './shared/model/todo';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

	public todos: Todo[];

  title = 'St4rsend';
  name: string = 'John';

	constructor(private todoService: TodoService) {}

	ngOnInit() {
		this.todos = this.todoService.getTodos();
	}
	
	createTodo(todo: Todo) {
		this.todoService.createTodo(todo);
	}

	onToggleCompletion(todo: Todo) {
		todo.completed = !todo.completed;
		console.log('ToggleCompletion executed: ', todo);
	}
	

	toAppComponent(msg: string) {
		console.log("AppComponent received msg: ",msg);
	}
}

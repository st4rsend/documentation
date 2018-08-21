import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface Todo {
  completed: boolean;
  label: string;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

	@Input() todos: Todo[];
	@Output() toggle = new EventEmitter<Todo>();

	toggleCompletion(index: number) {
		let todo = this.todos[index];
		this.toggle.emit(todo);
	}

  AddTodo(label: string) {
    this.todos.push({
      label,
      completed: false
    });
	}

	removeTodo(idx) {
		this.todos.splice(idx,1);
	}
}

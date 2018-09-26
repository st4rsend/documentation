import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  title = 'St4rsend';
  name: string = 'John';

	constructor() {}

	ngOnInit() {
	}
	toAppComponent(msg: string) {
		console.log("AppComponent received msg: ",msg);
	}
}

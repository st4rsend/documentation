import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatIconModule } from '@angular/material';

import { WebSocketService } from './shared/services/websocket.service';

import { AppComponent } from './app.component';
import { InputBoxComponent } from './input-box/input-box.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@NgModule({
  declarations: [
    AppComponent,
    InputBoxComponent,
    TodoListComponent,
  ],
  imports: [
    BrowserModule,
		FormsModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule
  ],
  providers: [
		WebSocketService
	],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { 
	MatButtonModule, 
	MatToolbarModule, 
	MatInputModule, 
	MatIconModule, 
	MatCheckboxModule 
} from '@angular/material';

import { AppComponent } from './app.component';
import { ListTodoComponent } from './todo/list-todo/list-todo.component';
import { CreateTodoComponent } from './todo/create-todo/create-todo.component';
import { ServerComComponent } from './server-com/server-com.component';

@NgModule({
  declarations: [
    AppComponent,
    ListTodoComponent,
    CreateTodoComponent,
    ServerComComponent,
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
	],
  bootstrap: [AppComponent]
})
export class AppModule { }

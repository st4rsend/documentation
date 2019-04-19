import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

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
import { DocBaseComponent } from './doc/doc-base/doc-base.component';
import { MenuDocComponent } from './doc/menu-doc/menu-doc.component';
import { DynDocComponent } from './doc/dyn-doc/dyn-doc.component';
import { TextItemDocComponent } from './doc/text-item-doc/text-item-doc.component';
import { SvgItemDocComponent } from './doc/svg-item-doc/svg-item-doc.component';
import { UrlSvgItemDocComponent } from './doc/url-svg-item-doc/url-svg-item-doc.component';
import { TodoBaseComponent } from './todo/todo-base/todo-base.component';
import { ListTodoComponent } from './todo/list-todo/list-todo.component';
import { CreateTodoComponent } from './todo/create-todo/create-todo.component';
import { UpdateTodoComponent } from './todo/update-todo/update-todo.component';
import { ServerComComponent } from './server-com/server-com.component';
import { AppRoutesModule } from './app-routes.module';

@NgModule({
  declarations: [
    AppComponent,
		DocBaseComponent,
		MenuDocComponent,
		DynDocComponent,
		TextItemDocComponent,
		SvgItemDocComponent,
		UrlSvgItemDocComponent,
		TodoBaseComponent,
    ListTodoComponent,
    CreateTodoComponent,
		UpdateTodoComponent,
    ServerComComponent,
  ],
  imports: [
    BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		AppRoutesModule
  ],
  providers: [
	],
  bootstrap: [AppComponent]
})
export class AppModule { }

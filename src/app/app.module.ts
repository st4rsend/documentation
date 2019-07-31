import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
//import { FlexLayoutModule } from '@angular/flex-layout';
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
import { EditItemDocComponent } from './doc/edit-item-doc/edit-item-doc.component';
import { TextItemDocComponent } from './doc/text-item-doc/text-item-doc.component';
import { SvgItemDocComponent } from './doc/svg-item-doc/svg-item-doc.component';
import { UrlSvgItemDocComponent } from './doc/url-svg-item-doc/url-svg-item-doc.component';
import { ListItemDocComponent } from './doc/list-item-doc/list-item-doc.component';
import { ListSelectDocComponent } from './doc/list-select-doc/list-select-doc.component';
import { TodoBaseComponent } from './todo/todo-base/todo-base.component';
import { ListTodoComponent } from './todo/list-todo/list-todo.component';
import { CreateTodoComponent } from './todo/create-todo/create-todo.component';
import { UpdateTodoComponent } from './todo/update-todo/update-todo.component';
import { LoginComponent } from './mgmt/login/login.component';
import { ListMgmtComponent } from './shared/component/list-mgmt/list-mgmt.component';
import { ListSelectComponent } from './shared/component/list-select/list-select.component';
import { ServerComComponent } from './mgmt/server-com/server-com.component';
import { MgmtBaseComponent } from './mgmt/mgmt-base/mgmt-base.component';
import { AppRoutesModule } from './app-routes.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
		DocBaseComponent,
		MenuDocComponent,
		DynDocComponent,
		EditItemDocComponent,
		TextItemDocComponent,
		SvgItemDocComponent,
		UrlSvgItemDocComponent,
		ListItemDocComponent,
		ListSelectDocComponent,
		TodoBaseComponent,
    ListTodoComponent,
    CreateTodoComponent,
		UpdateTodoComponent,
		LoginComponent,
		ListMgmtComponent,
		ListSelectComponent,
		MgmtBaseComponent,
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
		AppRoutesModule,
		DragDropModule,
		ScrollDispatchModule,
//		FlexLayoutModule
  ],
  providers: [
	],
  bootstrap: [AppComponent]
})
export class AppModule { 
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { AppRoutesModule } from './app-routes.module';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './mgmt/register/register.component';
import { DocBaseComponent } from './doc/view/doc-base/doc-base.component';
import { MenuDocComponent } from './doc/view/menu-doc/menu-doc.component';
import { DynDocComponent } from './doc/view/dyn-doc/dyn-doc.component';
import { EditItemDocComponent } from './doc/view/edit-item-doc/edit-item-doc.component';
import { EditTextareaDocComponent } from './doc/view/edit-textarea-doc/edit-textarea-doc.component';
import { TextItemDocComponent } from './doc/view/text-item-doc/text-item-doc.component';
import { SvgItemDocComponent } from './doc/view/svg-item-doc/svg-item-doc.component';
import { UrlSvgItemDocComponent } from './doc/view/url-svg-item-doc/url-svg-item-doc.component';
import { ListItemDocComponent } from './doc/view/list-item-doc/list-item-doc.component';
import { ListSelectDocComponent } from './doc/view/list-select-doc/list-select-doc.component';
import { TodoBaseComponent } from './todo/todo-base/todo-base.component';
import { ListTodoComponent } from './todo/list-todo/list-todo.component';
import { CreateTodoComponent } from './todo/create-todo/create-todo.component';
import { UpdateTodoComponent } from './todo/update-todo/update-todo.component';
import { LoginComponent } from './mgmt/login/login.component';
import { SetPasswordComponent } from './mgmt/set-password/set-password.component';
import { ListMgmtComponent } from './shared/component/list-mgmt/list-mgmt.component';
import { ListSelectComponent } from './shared/component/list-select/list-select.component';
import { ServerComComponent } from './server-com/server-com.component';
import { MgmtFooterComponent } from './mgmt/mgmt-footer/mgmt-footer.component';
import { MgmtBaseComponent } from './doc/admin/mgmt-base/mgmt-base.component';
import { DocListFinderComponent } from './doc/admin/doc-list-finder/doc-list-finder.component';


@NgModule({
  declarations: [
    AppComponent,
		HomeComponent,
		RegisterComponent,
		DocBaseComponent,
		MenuDocComponent,
		DynDocComponent,
		EditItemDocComponent,
		EditTextareaDocComponent,
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
		SetPasswordComponent,
		ListMgmtComponent,
		ListSelectComponent,
		MgmtBaseComponent,
		MgmtFooterComponent,
		DocListFinderComponent,
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
		MatMenuModule,
		MatSelectModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		AppRoutesModule,
		DragDropModule,
		ScrollingModule,
		FlexLayoutModule,
  ],
  providers: [
	],
  bootstrap: [AppComponent],
	entryComponents: [EditItemDocComponent],
})
export class AppModule { 
}

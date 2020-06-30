import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DocBaseComponent } from './doc/view/doc-base/doc-base.component';
import { TodoBaseComponent } from './todo/todo-base/todo-base.component';
import { MgmtBaseComponent } from './doc/admin/mgmt-base/mgmt-base.component';

const appRoutes: Routes = [

	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	//{ path: 'doc/base/:id', component: DocBaseComponent },
	{ path: 'doc/base/:id', component: DocBaseComponent },
	{ path: 'todo/base', component: TodoBaseComponent },
	{ path: 'mgmt/base', component: MgmtBaseComponent },
];


@NgModule({
  imports: [
//    CommonModule
		RouterModule.forRoot(
			appRoutes,
//			{ enableTracing: true }
		),
  ],
	exports: [
		RouterModule
	],
  declarations: []
})
export class AppRoutesModule { }

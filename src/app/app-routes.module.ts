import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// We don't intend to declare any component as part of the routing module so:
//import { CommonModule } from '@angular/common';
import { DocBaseComponent } from './doc/doc-base/doc-base.component';
import { TodoBaseComponent } from './todo/todo-base/todo-base.component';
import { MgmtBaseComponent } from './mgmt/mgmt-base/mgmt-base.component';

const appRoutes: Routes = [

	{ path: '', redirectTo: '/', pathMatch: 'full' },
	{ path: 'doc/base', component: DocBaseComponent },
	{ path: 'todo/base', component: TodoBaseComponent },
	{ path: 'mgmt/base', component: MgmtBaseComponent },
];


@NgModule({
  imports: [
//    CommonModule
		RouterModule.forRoot(appRoutes),
  ],
	exports: [
		RouterModule
	],
  declarations: []
})
export class AppRoutesModule { }

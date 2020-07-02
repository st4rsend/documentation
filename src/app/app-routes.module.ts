import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DocBaseComponent } from './doc/view/doc-base/doc-base.component';
import { MgmtBaseComponent } from './doc/admin/mgmt-base/mgmt-base.component';

const appRoutes: Routes = [

	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'doc/base/:id/:desc', component: DocBaseComponent },
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

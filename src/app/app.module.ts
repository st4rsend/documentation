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
import {MatSliderModule} from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppComponent } from './app.component';
import { AppRoutesModule } from './app-routes.module';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './mgmt/register/register.component';
import { DocBaseComponent } from './doc/view/doc-base/doc-base.component';
import { MenuDocComponent } from './doc/view/menu-doc/menu-doc.component';
import { NavFilterComponent } from './doc/view/menu-doc/nav-filter/nav-filter.component';
import { NavMapComponent } from './doc/view/menu-doc/nav-map/nav-map.component';
import { NavOptionsComponent } from './doc/view/menu-doc/nav-options/nav-options.component';
import { DynDocComponent } from './doc/view/dyn-doc/dyn-doc.component';
import { EditItemDocComponent } from './doc/view/edit-item-doc/edit-item-doc.component';
import { EditTextareaDocComponent } from './doc/view/edit-textarea-doc/edit-textarea-doc.component';
import { TextItemDocComponent } from './doc/view/text-item-doc/text-item-doc.component';
import { SvgItemDocComponent } from './doc/view/svg-item-doc/svg-item-doc.component';
import { UrlSvgItemDocComponent } from './doc/view/url-svg-item-doc/url-svg-item-doc.component';
import { MathjaxItemDocComponent } from './doc/view/mathjax-item-doc/mathjax-item-doc.component';
import { ListSelectDocComponent } from './doc/view/list-select-doc/list-select-doc.component';
import { LoginComponent } from './mgmt/login/login.component';
import { SetPasswordComponent } from './mgmt/set-password/set-password.component';
import { ListMgmtComponent } from './shared/component/list-mgmt/list-mgmt.component';
import { ListSelectComponent } from './shared/component/list-select/list-select.component';
import { ServerComComponent } from './server-com/server-com.component';
import { MgmtFooterComponent } from './mgmt/mgmt-footer/mgmt-footer.component';
import { MgmtBaseComponent } from './doc/admin/mgmt-base/mgmt-base.component';
import { DocListFinderComponent } from './doc/admin/doc-list-finder/doc-list-finder.component';

import { MathModule } from './shared/mathjax/math.module';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        RegisterComponent,
        DocBaseComponent,
        MenuDocComponent,
        NavFilterComponent,
        NavMapComponent,
        NavOptionsComponent,
        DynDocComponent,
        EditItemDocComponent,
        EditTextareaDocComponent,
        TextItemDocComponent,
        SvgItemDocComponent,
        UrlSvgItemDocComponent,
        MathjaxItemDocComponent,
        ListSelectDocComponent,
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
        MatSliderModule,
        MatFormFieldModule,
        AppRoutesModule,
        DragDropModule,
        ScrollingModule,
        FlexLayoutModule,
        MathModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { 
}

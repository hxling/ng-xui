import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NavMenuComponent } from './components/left-sidebar/nav-menu.component';
import { NavFilterComponent } from './components/left-sidebar/nav-filter.component';
import { PageLogoComponent } from './components/page-logo/page-logo.component';
import { PageWrapperComponent } from './components/container/page-wrapper.component';
import { UserInfoCardComponent } from './components/left-sidebar/userinfo-card.component';
import { PageHeaderComponent } from './components/header/page-header.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        PageLogoComponent,
        PageWrapperComponent,
        NavFilterComponent,
        NavMenuComponent,
        UserInfoCardComponent,
        PageHeaderComponent,
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

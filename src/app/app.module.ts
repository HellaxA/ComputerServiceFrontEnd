import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InterceptorService} from './helpers/interceptor/interceptor.service';
import {ErrorInterceptorService} from './helpers/interceptor/error-interceptor.service';
import { LandingComponent } from './components/landing/landing.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

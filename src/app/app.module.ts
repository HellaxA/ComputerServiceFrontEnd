import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {InterceptorService} from './helpers/interceptor/interceptor.service';
import {ErrorInterceptorService} from './helpers/interceptor/error-interceptor.service';
import {LandingComponent} from './components/landing/landing.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {SavePasswordComponent} from './components/save-password/save-password.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import { LibraryComponent } from './components/library/library.component';
import { GpusComponent } from './components/gpus/gpus.component';
import { CpusComponent } from './components/cpus/cpus.component';
import { MotherboardsComponent } from './components/motherboards/motherboards.component';
import { RamsComponent } from './components/rams/rams.component';
import { PowerSuppliesComponent } from './components/power-supplies/power-supplies.component';
import { PcLibraryComponent } from './components/pc-library/pc-library.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    NavbarComponent,
    ForgotPasswordComponent,
    SavePasswordComponent,
    SignUpComponent,
    LibraryComponent,
    GpusComponent,
    CpusComponent,
    MotherboardsComponent,
    RamsComponent,
    PowerSuppliesComponent,
    PcLibraryComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

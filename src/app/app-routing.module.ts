import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {LandingComponent} from './components/landing/landing.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {SavePasswordComponent} from './components/save-password/save-password.component';

const routes: Routes = [
  {path: '', redirectTo: 'landing', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'landing', component: LandingComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'save-password', component: SavePasswordComponent},
  {path: '**', redirectTo: 'landing', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}

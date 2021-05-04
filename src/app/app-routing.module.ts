import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {LandingComponent} from './components/landing/landing.component';
import {GpuComponent} from './components/gpu/gpu.component';

const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'landing', component: LandingComponent},
  {path: 'test', component: GpuComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {LandingComponent} from './components/landing/landing.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {SavePasswordComponent} from './components/save-password/save-password.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {LibraryComponent} from './components/library/library.component';
import {PcLibraryComponent} from './components/pc-library/pc-library.component';
import {AuthGuardService} from './helpers/authguard/auth-guard.service';
import {CpusComponent} from './components/cpus/cpus.component';
import {RamsComponent} from './components/rams/rams.component';
import {PowerSuppliesComponent} from './components/power-supplies/power-supplies.component';
import {MotherboardsComponent} from './components/motherboards/motherboards.component';
import {GpusComponent} from './components/gpus/gpus.component';

const routes: Routes = [
  {path: '', redirectTo: 'landing', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'landing', component: LandingComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'save-password', component: SavePasswordComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'library', component: LibraryComponent},
  {path: 'pc-library', component: PcLibraryComponent, canActivate: [AuthGuardService] },
  {path: 'cpus/:name', component: CpusComponent, canActivate: [AuthGuardService] },
  {path: 'gpus/:name', component: GpusComponent, canActivate: [AuthGuardService] },
  {path: 'motherboards/:name', component: MotherboardsComponent, canActivate: [AuthGuardService] },
  {path: 'power-supplies/:name', component: PowerSuppliesComponent, canActivate: [AuthGuardService] },
  {path: 'rams/:name', component: RamsComponent, canActivate: [AuthGuardService] },
  {path: '**', redirectTo: 'landing', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}

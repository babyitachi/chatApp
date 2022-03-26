import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConvoComponent } from './convo/convo.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomeActivatorService } from './services/homeActivator.service';
import { LoginCheckerService } from './services/loginChecker.service';


const routes: Routes = [
  { path: "convo/:user", component: ConvoComponent,canActivate: [HomeActivatorService] },
  { path: "login", component: LoginComponent,canActivate:[LoginCheckerService] },
  { path: "home", component: HomeComponent, canActivate: [HomeActivatorService]},
  { path: "", pathMatch: "full", component: LandingComponent,canActivate:[LoginCheckerService] },
  { path: "**", component: LandingComponent,canActivate:[LoginCheckerService]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

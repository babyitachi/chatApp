import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConvoComponent } from './convo/convo.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { HomeActivatorService } from './services/homeActivator.service';


const routes: Routes = [
  { path: "convo/:user", component: ConvoComponent,canActivate: [HomeActivatorService] },
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent, canActivate: [HomeActivatorService]},
  { path: "", pathMatch: "full", component: LandingComponent },
  { path: "**", component: LandingComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

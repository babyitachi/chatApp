import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatApp';
  isLoggedin: boolean;
  constructor(private router: Router, private loginService: LoginService) {
    this.isLoggedin = false;
    this.loginService.isLoggedIn.subscribe(state => {
      this.isLoggedin = state;
    })
  }

  goHome() {
    if (this.isLoggedin) {
      this.router.navigateByUrl("/home");
    } else {
      this.router.navigateByUrl("/");

    }
  }

  login() {
    try {
      if (!this.isLoggedin) {
        this.router.navigateByUrl('login');
      } else {
        //logout
        this.loginService.setLoggedInState(false);
        this.router.navigateByUrl("/");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

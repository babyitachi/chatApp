import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLogin: boolean;
  username: FormControl;
  password: FormControl;

  constructor(private router: Router,private loginService: LoginService) {
    this.isLogin = false;
    this.username = new FormControl('', [Validators.required, Validators.nullValidator]);
    this.password = new FormControl('', [Validators.required, Validators.nullValidator]);
  }

  ngOnInit() {

  }

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  loginSignup() {
    this.loginService.login(true).subscribe(resp=>{console.log(resp);
    if(resp){
      this.loginService.setLoggedInState(resp);
      this.router.navigateByUrl('/home')
    }});
  }

}

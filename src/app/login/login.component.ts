import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginModel } from '../models/login.model';
import { LoginService } from '../services/login.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLogin: boolean;
  username: FormControl;
  password: FormControl;

  constructor(private router: Router, private loginService: LoginService, private socketService: SocketService) {
    this.isLogin = true;
    this.username = new FormControl('', [Validators.required, Validators.nullValidator]);
    this.password = new FormControl('', [Validators.required, Validators.nullValidator]);
  }

  ngOnInit() {

  }

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  loginSignup() {
    if (!this.username.errors && !this.password.errors) {
      var logindata = new LoginModel();
      logindata.username = this.username.value;
      logindata.password = this.password.value;
      if (this.isLogin) {
        this.loginService.login(logindata).subscribe(resp => {
          console.log(resp);
          if (resp.resp) {
            this.loginService.setLoggedInState(resp.resp);
            this.socketService.socket.emit('join', this.username.value);
            this.loginService.setUsername(this.username.value);
            this.router.navigateByUrl('/home')
          }else{
            alert(resp.msg);
          }
        });
      } else {
        this.loginService.signup(logindata).subscribe(resp => {
          console.log(resp);
          if (resp.resp) {
            this.loginService.setLoggedInState(resp.resp);
            this.socketService.socket.emit('join', this.username.value);
            this.loginService.setUsername(this.username.value);
            this.router.navigateByUrl('/home')
          }else{
            alert(resp.msg)
          }
        });
      }
    }
  }

}

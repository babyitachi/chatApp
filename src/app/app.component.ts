import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { SocketService } from './services/socket.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'chatApp';
  isLoggedin: boolean;
  username: string;
  constructor(private router: Router,
    private loginService: LoginService, private socketService: SocketService, private usersService: UsersService) {
    this.isLoggedin = false;
    this.loginService.isLoggedIn.subscribe(state => {
      this.isLoggedin = state;
    })
    this.loginService.username.subscribe(user => {
      this.username = user;
    });
    this.username = "";
    this.socketService.socket.on('users', userslist => {
      console.log(userslist)
      this.usersService.setAllActiveUsers(userslist);
    })
    this.socketService.socket.on('connect', () => {
      this.socketService.socket.emit('sendUpdatedClients');  
    })
  }

  ngOnInit() {
   
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
        this.loginService.setUsername("");
        this.socketService.socket.emit('logout',()=>{});
        this.router.navigateByUrl("/");
      }
    } catch (e) {
      console.log(e);
    }
  }
}

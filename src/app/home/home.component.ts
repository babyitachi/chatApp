import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  activeUsers: any[];
  constructor(private router: Router, private usersService: UsersService, private socketService: SocketService, private loginService: LoginService) {
    this.activeUsers = [];
  }

  ngOnInit() {
    this.activeUsers=this.usersService.getActiveUsers();
    this.userSub = this.usersService.activeUsersList.subscribe(users => {
      this.activeUsers = users;
      this.activeUsers=users.splice(users.indexOf(this.loginService.getUsername()), 1)
    })
  }

  chatWith(user) {
    this.router.navigate([`/convo`, user]);
  }
  ngOnDestroy(): void {
    if (!this.userSub.closed) {
      this.userSub.unsubscribe();
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { SocketService } from '../services/socket.service';
import { TypingsService } from '../services/typings.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  userSub: Subscription;
  activeUsers: any[];
  constructor(private router: Router, private typingsService: TypingsService,
     private usersService: UsersService, private socketService: SocketService, private loginService: LoginService) {
    this.activeUsers = [];
  }

  ngOnInit() {
    this.activeUsers = this.usersService.getActiveUsers();
    this.userSub = this.usersService.activeUsersList.subscribe(users => {
      let actu = [];
      let username = this.loginService.getUsername().toLowerCase();
      users.forEach(u => {
        if (u != username) {
        actu.push(this.typingsService.toPascleCase(u.toString()));
        }
      })
      this.activeUsers = Object.assign([], actu);
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

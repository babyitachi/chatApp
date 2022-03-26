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
  pastUsers: any[];
  constructor(private router: Router, private typingsService: TypingsService,
    private usersService: UsersService, private socketService: SocketService, private loginService: LoginService) {
    this.activeUsers = [];
  }

  removeActiveusersFromPast() {
    this.activeUsers.forEach(x => {
      let xindex = this.pastUsers.indexOf(x);
      if (xindex >= 0) {
        this.pastUsers.splice(xindex, 1);
      }
    })
  }
  getPastUsers() {
    this.loginService.getPastUsers(this.loginService.getUsername()).subscribe(users => {
      if (users) {
        this.usersService.setAllPastUsers(users);
        this.pastUsers = users.map(x => this.typingsService.toPascleCase(x));
        this.removeActiveusersFromPast();
      }
    });
  }

  ngOnInit() {

    this.activeUsers = this.usersService.getActiveUsers();
    this.pastUsers = this.usersService.getPastUsers();
    this.userSub = this.usersService.activeUsersList.subscribe(users => {
      let actu = [];
      let username = this.loginService.getUsername().toLowerCase();
      users.forEach(u => {
        if (u != username) {
          actu.push(this.typingsService.toPascleCase(u.toString()));
        }
      })
      this.activeUsers = Object.assign([], actu);
      this.getPastUsers();
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

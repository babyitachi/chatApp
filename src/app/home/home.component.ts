import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SocketService } from '../services/socket.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  activeUsers: any[];
  constructor(private usersService: UsersService, private socketService: SocketService,private loginService:LoginService) {
    this.activeUsers = [];
  }

  ngOnInit() {
    this.usersService.activeUsersList.subscribe(users => {
      this.activeUsers = users;
      this.activeUsers.splice(this.activeUsers.indexOf(this.loginService.getUsername()),1)
    })
  }

  chatWith(user) {

  }
}

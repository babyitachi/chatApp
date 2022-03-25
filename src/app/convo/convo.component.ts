import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { LoginService } from '../services/login.service';
import { SocketService } from '../services/socket.service';
import { TypingsService } from '../services/typings.service';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.component.html',
  styleUrls: ['./convo.component.scss']
})
export class ConvoComponent implements OnInit {
  user: string;
  sendMsgTxt: any;
  msgText: FormControl;
  fromUser: string;
  toUser: string;
  chatid: string

  constructor(private router: Router, private chatService: ChatService,
    private typingsService: TypingsService, private socketService: SocketService, private loginService: LoginService) {
    this.user = "test";
    this.sendMsgTxt = [];
    this.msgText = new FormControl('', [Validators.required, Validators.nullValidator]);
    let path = this.router.url.split("/");
    this.user = this.typingsService.toPascleCase(path[path.length - 1]);
    this.fromUser = this.loginService.getUsername().toString().toLowerCase();
    this.toUser = this.user.toString().toLowerCase();
    this.chatid = [this.fromUser, this.toUser].sort().join("");
  }

  ngOnInit() {
    this.socketService.socket.on('recievedText', (data) => {
      console.log('from recieved data: ', data)
      this.sendMsgTxt = { 'my': 0, 'msg': data['text'] };
    });
    this.getChatConvo();
  }

  generateChat(chats: []) {
    chats = chats.sort(function (first, second) {
      return first['time'] - second['time'];
    })
    let conv = [];
    chats.forEach(x => {
      let m = x['data']['fromuser'] == this.fromUser;
      conv.push({ 'my': m ? 1 : 0, 'msg': x['data']['text'] });
    });
    this.sendMsgTxt = conv;
  }

  getChatConvo() {
    this.chatService.getChats(this.chatid).subscribe(chats => {
      if (chats.length > 0) {
        this.generateChat(chats);
        console.log('chats', chats);
      }
    })
  }

  sendMsg() {
    if (!this.msgText.errors) {
      this.sendMsgTxt = [{ 'my': 1, 'msg': this.msgText.value.toString() }];
      this.socketService.socket.emit('sendText',
        {
          'chatid': this.chatid, 'fromuser': this.fromUser, 'touser': this.toUser,
          'text': this.msgText.value.toString(), 'timestamp': Date.now(), 'state': 0
        })
      this.msgText.reset();
    }

  }
}

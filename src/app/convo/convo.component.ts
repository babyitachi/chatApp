import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(private router: Router, private typingsService: TypingsService) {
    this.user = "test";
    this.sendMsgTxt = {};
    this.msgText = new FormControl('', [Validators.required, Validators.nullValidator]);
    let path = this.router.url.split("/");
    this.user = this.typingsService.toPascleCase(path[path.length - 1]);
  }

  ngOnInit() {
  }

  sendMsg() {
    if (!this.msgText.errors) {
      this.sendMsgTxt = { 'my': 1, 'msg': this.msgText.value.toString() };
      this.msgText.reset();
    }

  }
}

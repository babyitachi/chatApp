import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.component.html',
  styleUrls: ['./convo.component.scss']
})
export class ConvoComponent implements OnInit {
  user:string;
  constructor() {this.user="test" }

  ngOnInit() {
  }

}

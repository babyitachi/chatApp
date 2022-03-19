import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypingsService } from '../services/typings.service';

@Component({
  selector: 'app-convo',
  templateUrl: './convo.component.html',
  styleUrls: ['./convo.component.scss']
})
export class ConvoComponent implements OnInit {
  user: string;
  constructor(private router: Router, private typingsService: TypingsService) {
    this.user = "test";
    let path = this.router.url.split("/");
    this.user = this.typingsService.toPascleCase(path[path.length - 1]);
  }

  ngOnInit() {
  }

}

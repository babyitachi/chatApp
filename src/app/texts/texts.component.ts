import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-texts',
  templateUrl: './texts.component.html',
  styleUrls: ['./texts.component.scss']
})
export class TextsComponent implements OnInit {
  con=[{'my':1,'msg':'hi'},{'my':0,'msg':'hi,how are you?'},{'my':1,'msg':'good!'},{'my':0,'msg':'dfnsdn ndklns nkmkds nmds kgood!'}];
  constructor() { }

  ngOnInit() {
  }

}

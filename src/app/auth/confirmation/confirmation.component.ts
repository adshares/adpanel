import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  email: string = 'mateuszpiatek@10clouds.com'

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentBalanceAdst: number = 128.20;
  currentBalanceUSD: number = 1240.02;
  notificationsCount: number = 8;

  notificationsBarEnabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleNotificationsBar(status: boolean) {
    this.notificationsBarEnabled = status;
  }
}

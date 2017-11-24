import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentBalanceAdst: number = 128.20;
  currentBalanceUSD: number = 1240.02;
  notificationsCount: number = 8;

  notificationsBarEnabled: boolean = false;

  toggleNotificationsBar(status: boolean) {
    this.notificationsBarEnabled = status;
  }
}

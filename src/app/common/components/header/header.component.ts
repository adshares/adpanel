import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserModel } from '../../../models/user.model';
import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../store/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends HandleSubscription implements OnInit {
  currentBalanceAdst: number = 128.20;
  currentBalanceUSD: number = 1240.02;
  notificationsCount: number = 8;
  selectedRole: string = 'Admin';
  state: Store<AppState>;

  notificationsBarEnabled: boolean = false;

  constructor(private store: Store<{state}>) {
    super(null);

    this.state = this.store.select('state');
  }

  ngOnInit() {
    const getUserSubscription = this.state
      .subscribe((state) => {
        const userData = state.auth.userData;

        this.checkUserRole(userData);
      });
    this.subscriptions.push(getUserSubscription);
  }

  toggleNotificationsBar(status: boolean) {
    this.notificationsBarEnabled = status;
  }

  checkUserRole(user: UserModel) {
    if (user.isAdmin) {
      return;
    }

    this.selectedRole = user.isAdvertiser ? 'Advertiser' : 'Publisher';
  }
}

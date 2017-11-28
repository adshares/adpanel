import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { UserModel } from '../../../auth/store/user.model';
import { HandleSubscription } from '../../handle-subscription';

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
  auth: Store<{userData}>;

  notificationsBarEnabled: boolean = false;

  constructor(private store: Store<{auth}>) {
    super(null);

    this.auth = this.store.select('auth');
  }

  ngOnInit() {
    const getUserSubscription = this.auth
      .subscribe((authStore) => {
        const userData = authStore.userData;

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

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
  user: UserModel;
  selectedRole: string = 'Admin';

  notificationsBarEnabled: boolean = false;

  constructor(private store: Store<{auth}>) {
    super(null);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('auth')
        .subscribe((authStore) => {
          this.user = authStore.userData;
          this.checkUserRole();
        })
    );
  }

  toggleNotificationsBar(status: boolean) {
    this.notificationsBarEnabled = status;
  }

  checkUserRole() {
    if (this.user.isAdmin) {
      return;
    }

    this.selectedRole = this.user.isAdvertiser ? 'Advertiser' : 'Publisher';
  }
}

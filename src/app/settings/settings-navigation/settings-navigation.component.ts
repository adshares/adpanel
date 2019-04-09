import { Component } from '@angular/core';

import { SessionService } from "app/session.service";
import { LocalStorageUser } from 'models/user.model';
import { Store } from "@ngrx/store";
import { AppState } from "models/app-state.model";
import { HandleSubscription } from "common/handle-subscription";
import { UserWallet } from "models/settings.model";

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './settings-navigation.component.html',
  styleUrls: ['./settings-navigation.component.scss'],
})
export class SettingsNavigationComponent extends HandleSubscription {
  wallet: UserWallet;
  totalFunds: number;
  user: LocalStorageUser;
  // userRoles: Store<UserRoles>

  settings = [
    {
      title: 'Account Settings',
      description: 'Your changes to general settings from the Advertiser point ' +
        'will affect the changes in your Publisher account',
      link: '/settings/general',
      values: [
        {name: 'Email & Password', icon: 'assets/images/preferences.svg'},
        /*
                        { name: 'Notification settings', icon: 'assets/images/notifications.svg'},
        */
      ],
    },
    {
      title: 'Billing & Payments',
      description: '',
      link: '/settings/billing',
      values: [
        {name: 'Your wallet', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Billing History', icon: 'assets/images/history.svg'}
      ],
    }
  ];

  constructor(
    private session: SessionService,
    private store: Store<AppState>
  ) {
    super()
  }

  ngOnInit() {
    this.user = this.session.getUser();
    const userDataStateSubscription = this.store
      .select('state', 'user', 'settings', 'wallet', 'totalFunds')
      .subscribe((totalFunds: number) => {
        this.totalFunds = totalFunds;
      });
    this.subscriptions.push(userDataStateSubscription);
  }
}

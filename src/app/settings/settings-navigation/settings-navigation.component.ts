import { Component } from '@angular/core';

import { SessionService } from "app/session.service";
import { LocalStorageUser, UserAdserverWallet } from 'models/user.model';

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './settings-navigation.component.html',
  styleUrls: ['./settings-navigation.component.scss'],
})
export class SettingsNavigationComponent {
  adserverWallet: UserAdserverWallet;
  user: LocalStorageUser;
  // userRoles: Store<UserRoles>

  settings = [
    {
      title: 'Account Settings',
      description: 'Your changes to general settings from the Advertiser point ' +
        'will affect the changes in your Publisher account',
      link: 'general',
      values: [
        {name: 'Email & Password', icon: 'assets/images/preferences.svg'},
        /*
                        { name: 'Notification settings', icon: 'assets/images/notifications.svg'},
        */
      ],
      admin: true,
    },
    {
      title: 'Billing & Payments',
      description: '',
      link: 'billing',
      values: [
        {name: 'Your wallet', icon: 'assets/images/wallet--gray.svg'},
        {name: 'Billing History', icon: 'assets/images/history.svg'}
      ],
      admin: false,
    }
  ];

  constructor(
    private session: SessionService,
  ) {
  }

  ngOnInit() {
    this.user = this.session.getUser();
    this.adserverWallet = this.user.adserverWallet;
    console.log(this.user);
    console.log(this.adserverWallet);
  }
}

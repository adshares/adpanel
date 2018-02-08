import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './settings-navigation.component.html',
  styleUrls: ['./settings-navigation.component.scss'],
})
export class SettingsNavigationComponent {
  settings = [
    {
      title: 'General Settings',
      description: 'Your changes to general settings from the Advertiser point ' +
                    'will affect the changes in your Publisher account',
      link: 'general',
      values: [
        { name: 'Preferences', icon: 'assets/images/preferences.svg'},
        { name: 'Notification settings', icon: 'assets/images/notifications.svg'},
      ]
    },
    {
      title: 'Billing & Payments',
      description: '',
      link: 'billing',
      values: [
        { name: 'Your wallet', icon: 'assets/images/wallet--gray.svg'},
        { name: 'Billing History', icon: 'assets/images/history.svg'}
      ]
    }
  ];
}

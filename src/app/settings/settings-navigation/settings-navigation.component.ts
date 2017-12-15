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
        { name: 'Preferences'},
        { name: 'Notification settings'},
      ]
    },
    {
      title: 'Billing & Payments',
      description: '',
      link: 'billing',
      values: [
        { name: 'Your wallet'},
        { name: 'Billing History'}
      ]
    }
  ];
}

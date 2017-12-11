import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-navigation',
  templateUrl: './settings-navigation.component.html',
  styleUrls: ['./settings-navigation.component.scss'],
})
export class SettingsNavigationComponent implements OnInit {
  settings = [
    {
      title: 'General Settings',
      description: 'Your changes to general settings from the Advertiser point ' +
                    'will affect the changes in your Publisher account',
      link: 'general',
      values: [
        { name: 'Preferences'},
        { name: 'Notification settings'},
        { name: '2 Step Authentication'}
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
  ]

  constructor() { }

  ngOnInit() {
    console.log(this.settings)
  }

}

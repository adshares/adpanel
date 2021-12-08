import { Component } from '@angular/core'
import { HandleSubscription } from 'common/handle-subscription'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends HandleSubscription {
  settings = [
    {
      title: 'Users',
      description: '',
      link: '/agency/dashboard/users',
      values: [
        { name: 'Users List', icon: 'assets/images/user-gray.svg' },
        { name: 'Publishers', icon: 'assets/images/user-gray.svg' },
        { name: 'Reports', icon: 'assets/images/user-gray.svg' },
      ],
    },
    {
      title: 'Account settings',
      description: '',
      link: '/agency/dashboard/account',
      values: [
        { name: 'Email & password', icon: 'assets/images/preferences.svg' },
        { name: 'Referral links', icon: 'assets/images/preferences.svg' },
      ],
    },
  ]
}

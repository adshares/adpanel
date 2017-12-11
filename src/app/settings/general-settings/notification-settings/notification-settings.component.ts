import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {
  notificationItems = [
    {
      topic: 'Billing Alerts',
      component: true,
      email: false,
    },
    {
      topic: 'Campaign Maintenance Alerts',
      component: true,
      email: false,
    },
    {
      topic: 'Newsletter',
      component: false,
      email: false,
    },
    {
      topic: 'Performance Suggestions',
      component: true,
      email: false,
    },
    {
      topic: 'Special Offers',
      component: true,
      email: true,
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}

import { Component } from '@angular/core';
import { PushNotification } from 'models/push-notification';

import { PushNotificationsService } from './push-notifications.service'

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent {
  pushNotifications: PushNotification[] = [];

  constructor(private pushNotificationsService: PushNotificationsService) {
    pushNotificationsService.pushNotificationAdded
      .subscribe(notification => this.pushNotifications.push(notification));
  }

  dismissNotification(pushNotification) {
    const pushNotificationIndex = this.pushNotifications.indexOf(pushNotification);

    this.pushNotifications.splice(pushNotificationIndex, 1);
  }
}

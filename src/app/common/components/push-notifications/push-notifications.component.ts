import { Component } from '@angular/core';

import { PushNotification } from 'models/push-notification';
import { PushNotificationsService } from './push-notifications.service'
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent extends HandleSubscription {
  pushNotifications: PushNotification[] = [];

  constructor(private pushNotificationsService: PushNotificationsService) {
    super();

    const pushNotificationAddedSubsctiption = pushNotificationsService.pushNotificationAdded
      .subscribe(notification => this.pushNotifications.push(notification));
    this.subscriptions.push(pushNotificationAddedSubsctiption);
  }

  dismissNotification(pushNotification: PushNotification) {
    const pushNotificationIndex = this.pushNotifications.indexOf(pushNotification);

    this.pushNotifications.splice(pushNotificationIndex, 1);
  }
}

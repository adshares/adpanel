import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { PushNotification } from 'models/push-notification';

@Injectable()
export class PushNotificationsService {
  pushNotification = new Subject<PushNotification>();

  pushNotificationAdded = this.pushNotification.asObservable();

  addPushNotification(pushNotification: PushNotification) {
    this.pushNotification.next(pushNotification);
  }
}

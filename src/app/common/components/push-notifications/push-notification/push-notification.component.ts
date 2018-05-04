import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { timer } from 'rxjs/observable/timer';

import { PushNotification } from 'models/push-notification';
import { pushNotifivationTypesEnum } from 'models/enum/push-notification.enum';
import { HandleSubscription } from 'common/handle-subscription';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
})
export class PushNotificationComponent extends HandleSubscription implements OnInit {
  @Input() pushNotification: PushNotification
  @Output() dismissNotification: EventEmitter<PushNotification> = new EventEmitter();

  pushNotifivationTypesEnum = pushNotifivationTypesEnum;
  timerLength = 100;

  constructor() {
    super();
  }

  ngOnInit() {
    const dismissNotificationTimer = timer(0, 1000)
      .subscribe((secondsElapsed) => {
        if (appSettings.DISMISS_PUSH_NOTIFICATION_INTERVAL <= secondsElapsed * 1000) {
          this.dismissPushNotification(this.pushNotification);
        }

        this.timerLength = 100 - ((secondsElapsed / appSettings.DISMISS_PUSH_NOTIFICATION_INTERVAL * 1000) * 100);
      });
    this.subscriptions.push(dismissNotificationTimer);
  }

  dismissPushNotification(notification) {
    this.dismissNotification.emit(notification);
  }
}

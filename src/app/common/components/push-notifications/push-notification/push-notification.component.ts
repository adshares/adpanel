import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss'],
})
export class PushNotificationComponent {
  // @Input() pushNotification: PushNotification
  @Input() pushNotification: any;

  dismissPushNotification() {

  }
}

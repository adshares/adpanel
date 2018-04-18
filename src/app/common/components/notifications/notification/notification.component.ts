import { Component, Input } from '@angular/core';
import { Notification } from 'models/notifications-model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notification: Notification;
}

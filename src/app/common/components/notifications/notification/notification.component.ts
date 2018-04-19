import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notification } from 'models/notifications-model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notification: Notification;
  @Output() onDismissNotification: EventEmitter<Notification> = new EventEmitter();


  dismissNotification() {
    this.onDismissNotification.emit(this.notification);
  }
}

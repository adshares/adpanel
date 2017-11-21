import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent {
  @Input() notificationsBarEnabled: boolean;
  @Output() onDisableNotificationsBar: EventEmitter<boolean> = new EventEmitter()

  disableNotificationsBar() {
    this.notificationsBarEnabled = false;
    this.onDisableNotificationsBar.emit(false);
  }

}

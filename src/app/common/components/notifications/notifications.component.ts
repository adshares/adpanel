import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { Notification } from 'models/notifications-model';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent extends HandleSubscription implements OnInit {
  @Input() notificationsBarEnabled: boolean;
  @Output() onDisableNotificationsBar: EventEmitter<boolean> = new EventEmitter();
  notifications: Notification[];

  constructor(private store: Store<AppState>) {
    super();
  }

  ngOnInit() {
    this.getNotificationsFromStore();
  }

  disableNotificationsBar() {
    this.notificationsBarEnabled = false;
    this.onDisableNotificationsBar.emit();
  }

  getNotificationsFromStore() {
    const notificationsSubscription = this.store.select('state', 'common', 'notifications')
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
      });

    this.subscriptions.push(notificationsSubscription);
  }

}

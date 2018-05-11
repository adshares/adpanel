import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from 'common/common.service';

import { Notification } from 'models/notification.model';
import { AppState } from 'models/app-state.model';
import { HandleSubscription } from 'common/handle-subscription';
import {
  notificationActionsEnum, notificationTypesEnum,
  notificationUserTypesEnum
} from 'models/enum/notifications.enum';

import * as commonActions from 'store/common/common.actions';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent extends HandleSubscription implements OnInit {
  @Input() notificationsBarOpen: boolean;
  @Output() onDisableNotificationsBar: EventEmitter<boolean> = new EventEmitter();

  notifications: Notification[];
  notificationUserTypesEnum = notificationUserTypesEnum;
  notificationTypesEnum = notificationTypesEnum;
  notificationActionsEnum = notificationActionsEnum;

  constructor(
    private store: Store<AppState>,
    private commonService: CommonService
  ) {
    super();
  }

  ngOnInit() {
    this.getNotificationsFromStore();
  }

  disableNotificationsBar() {
    this.notificationsBarOpen = false;
    this.onDisableNotificationsBar.emit();
  }

  getNotificationsFromStore() {
    const notificationsSubscription = this.store.select('state', 'common', 'notifications')
      .subscribe((notifications: Notification[]) => this.notifications = notifications);
    this.subscriptions.push(notificationsSubscription);
  }

  dismissNotification(notification) {
    this.commonService.dismissNotification(notification);

    this.notifications = this.notifications.filter(currentNotification => currentNotification.id !== notification.id);
    this.store.dispatch(new commonActions.UpdateNotifications(this.notifications));
  }
}

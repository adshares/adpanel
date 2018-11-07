import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'common/common.service';

import { SessionService } from "app/session.service";

import { Notification } from 'models/notification.model';
import { HandleSubscription } from 'common/handle-subscription';
import {
  notificationActionsEnum,
  notificationTypesEnum,
  notificationUserTypesEnum
} from 'models/enum/notifications.enum';

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
    private commonService: CommonService,
    private session: SessionService,
  ) {
    super();
  }

  ngOnInit() {
    this.notifications = this.session.getNotifications();
  }

  disableNotificationsBar() {
    this.notificationsBarOpen = false;
    this.onDisableNotificationsBar.emit();
  }

  dismissNotification(notification) {
    // TODO: fix
    // this.commonService.dismissNotification(notification);
    //
    // this.notifications = this.notifications.filter(currentNotification => currentNotification.id !== notification.id);
    // this.store.dispatch(new commonActions.UpdateNotifications(this.notifications));
  }
}

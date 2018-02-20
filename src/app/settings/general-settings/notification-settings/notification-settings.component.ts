import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../../models/app-state.model';
import { HandleSubscription } from '../../../common/handle-subscription';

import { NotificationItem } from '../../../models/settings.model';
import { SettingsService } from '../../settings.service';
import { cloneDeep } from '../../../common/utilities/helpers';
import * as settingsActions from '../../../store/settings/settings.actions';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent extends HandleSubscription implements OnInit {
  notificationsSettings: NotificationItem[];

  constructor(
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super(null);
  }

  ngOnInit() {
    const notificationSubscription = this.store.select('state', 'user', 'settings', 'notificationsSettings')
      .subscribe((notificationsSettings: NotificationItem[]) => {
        this.notificationsSettings = notificationsSettings;
      });
    this.subscriptions.push(notificationSubscription);

    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }

  onNotificationChange(notification, notificationType) {
    const type = notification.name;
    notification[notificationType] = !notification[notificationType];
    const settings = this.notificationsSettings;
    let newSettings;
    const settingsIndex = settings.findIndex((setting) => setting.name === type);

    settings[settingsIndex][notificationType] = notification[notificationType];
    newSettings = cloneDeep(settings);
    this.settingsService.updateNotificationsSettings(newSettings);
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }
}

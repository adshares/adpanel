import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';
import { NotificationSetting } from '../../../models/notification-setting.model';
import * as settingsActions from '../../../store/settings/settings.actions';

import { Subscription } from 'rxjs/Subscription';
import { SettingsService } from '../../settings.service';
import { cloneDeep } from '../../../common/utilities/helpers';


@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit{
  subscription: Subscription;
  notificationsSettings: NotificationSetting[];

  constructor(
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    this.subscription = store
      .select('state', 'user', 'settings', 'notificationsSettings')
      .subscribe(notificationsSettings => {
        this.notificationsSettings = notificationsSettings;
      });
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }

  onNotificationChange(notification, notificationType) {
    const type = notification.name;
    notification[notificationType] = !notification[notificationType]
    const settings = this.notificationsSettings;
    let newSettings;

    const settingsIndex = settings.findIndex((setting) => setting.type === type);
    settings[settingsIndex][notificationType] = notification[notificationType]
    newSettings = cloneDeep(settings);

    this.settingsService.updateNotificationsSettings(newSettings);
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }
}


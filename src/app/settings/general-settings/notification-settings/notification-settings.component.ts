import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';
import { NotificationSetting } from '../../../models/notification-setting.model';

import * as settingsActions from '../../../store/settings/settings.actions';

import { Subscription } from 'rxjs/Subscription';
import {SettingsService} from "../../settings.service";

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
        this.notificationsSettings = notificationsSettings
      });
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }

  onChange(event, type, newNotificationValue): any {
    const settings = this.notificationsSettings;
    const newSettings = [];

    for (let i = 0; i < settings.length; i++) {
      if (settings[i].type === type) {
        settings[i].notification = newNotificationValue;
      }
      newSettings.push(settings[i])
    }

    JSON.stringify(newSettings);

    this.settingsService.updateNotificationsSettings(newSettings);
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }
}


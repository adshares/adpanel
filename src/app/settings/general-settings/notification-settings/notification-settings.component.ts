import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';
import { NotificationSetting } from '../../../models/notification-setting.model';

import * as settingsActions from '../../../store/settings/settings.actions';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit{
  subscription: Subscription;
  notificationsSettings: NotificationSetting[];

  constructor(private store: Store<AppState>) {
    this.subscription = store
      .select('state', 'settings', 'notificationsSettings')
      .subscribe(notificationsSettings => {
        this.notificationsSettings = notificationsSettings
      });
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }

}

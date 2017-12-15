import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../../models/app-state.model';

import * as settingsActions from '../../../store/settings/settings.actions';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit{
  private subscription: Subscription;
  notificationItems: any;

  constructor(private store: Store<AppState>) {
    this.subscription = store
      .select('state', 'settings', 'notificationItems')
      .subscribe(notificationItems => this.notificationItems = notificationItems);
  }

  ngOnInit() {
    this.store.dispatch(new settingsActions.LoadNotificationsSettings(''));
  }

}

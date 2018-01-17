import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import * as settingsActions from './settings.actions';
import { SettingsService } from '../../settings/settings.service';
import { AppState } from '../../models/app-state.model';


@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private service: SettingsService,
    private store: Store<AppState>
  ) { }

  @Effect()
  loadBillingHistory$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_BILLING_HISTORY)
    .withLatestFrom(this.store.select('state', 'auth', 'userData', 'id'))
    .switchMap(([action, userId]) => this.service.getBillingHistory(userId))
    .map((billingHistory) => {
      return new settingsActions.LoadBillingHistorySuccess(billingHistory);
    });

  @Effect()
  loadNotificationsSettings$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_NOTIFICATIONS_SETTINGS)
    .withLatestFrom(this.store.select('state', 'auth', 'userData', 'id'))
    .switchMap(([action, userId]) => this.service.getNotificationsSettings(userId))
    .map((notificationsSettings) => {
      return new settingsActions.LoadNotificationsSettingsSuccess(notificationsSettings);
    });
}

import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';

import * as settingsActions from './settings.actions';
import { SettingsService } from './settings.service';

import 'rxjs/add/operator/switchMap';

@Injectable()
export class SettingsEffects {
  constructor (
    private actions$: Actions,
    private service: SettingsService
  ) {
  }

  @Effect()
  loadBillingHistory$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_BILLING_HISTORY)
    .map((action: settingsActions.LoadBillingHistory) => action.payload )
    .switchMap(() => this.service.getBillingHistory())
    .map((billingHistory) => {
      return new settingsActions.LoadBillingHistorySuccess(billingHistory);
    });

  @Effect()
  loadNotificationsSettings$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_NOTIFICATIONS_SETTINGS)
    .map((action: settingsActions.LoadNotificationsSettings) => action.payload )
    .switchMap(() => this.service.getNotificationsSettings())
    .map((notificationsSettings) => {
      return new settingsActions.LoadNotificationsSettingsSuccess(notificationsSettings);
    });
}

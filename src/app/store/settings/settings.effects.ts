import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import * as settingsActions from './settings.actions';
import { SettingsService } from 'settings/settings.service';


@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private service: SettingsService
  ) {
  }

  @Effect()
  loadBillingHistory$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_BILLING_HISTORY)
    .switchMap(() => this.service.getBillingHistory())
    .map((billingHistory) => new settingsActions.LoadBillingHistorySuccess(billingHistory));

  @Effect()
  loadNotificationsSettings$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_NOTIFICATIONS_SETTINGS)
    .switchMap(() => this.service.getNotificationsSettings())
    .map((notificationsSettings) => new settingsActions.LoadNotificationsSettingsSuccess(notificationsSettings));
}

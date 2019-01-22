import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as settingsActions from './settings.actions';
import {SettingsService} from 'settings/settings.service';
import {BillingHistory} from "models/settings.model";


@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private service: SettingsService
  ) {
  }

  @Effect()
  loadNotificationsSettings$: Observable<any> = this.actions$
    .ofType(settingsActions.LOAD_NOTIFICATIONS_SETTINGS)
    .switchMap(() => this.service.getNotificationsSettings())
    .map((notificationsSettings) => new settingsActions.LoadNotificationsSettingsSuccess(notificationsSettings));

  @Effect()
  getWalletBalanceInterval$: Observable<any> = this.actions$
    .ofType(settingsActions.GET_CURRENT_BALANCE)
    .take(1)
    .switchMap(() => Observable
      .timer(0, 100000)
      .switchMap(() => this.service.getNotificationsSettings()  //TODO request here
        .map((res) => {
          console.log('DZIAŁAM')
          return new settingsActions.GetCurrentBalanceSuccess(res)})
        .catch(err => Observable.of(new settingsActions.GetCurrentBalanceFailure(err)))
      )
    );
}

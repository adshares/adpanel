import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import "rxjs/add/observable/timer";
import "rxjs/add/operator/takeUntil";

import * as authActions from 'store/auth/auth.actions';
import * as settingsActions from './settings.actions';
import {SettingsService} from 'settings/settings.service';
import {ApiAuthService} from "../../api/auth.service";
import {Action} from "@ngrx/store/store";


@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private service: SettingsService,
    private authService: ApiAuthService
  ) {
  }

  // @Effect()
  // loadNotificationsSettings$: Observable<any> = this.actions$
  //   .ofType(settingsActions.LOAD_NOTIFICATIONS_SETTINGS)
  //   .switchMap(() => this.service.getNotificationsSettings())
  //   .map((notificationsSettings) => new settingsActions.LoadNotificationsSettingsSuccess(notificationsSettings));

  @Effect()
  getWalletBalanceInterval$: Observable<Action> = this.actions$
    .ofType(settingsActions.GET_CURRENT_BALANCE)

    // .switchMap(() => Observable
      // .timer(0, 5000)
      // .takeUntil(this.actions$.ofType(authActions.USER_LOG_OUT_SUCCESS))
      .switchMap(() => this.authService.check()
        .map((res) => new settingsActions.GetCurrentBalanceSuccess(res.adserverWallet.totalFunds))
        .catch(err => Observable.of(new settingsActions.GetCurrentBalanceFailure(err)))
      )
    // )
}

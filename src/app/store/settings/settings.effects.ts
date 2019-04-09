import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import "rxjs/add/observable/timer";
import "rxjs/add/operator/takeUntil";
import { USER_LOG_OUT_SUCCESS } from 'store/auth/auth.actions';
import {
  GET_CURRENT_BALANCE,
  GET_BILLING_HISTORY,
  GetCurrentBalanceSuccess,
  GetCurrentBalanceFailure,
  GetBillingHistorySuccess,
  GetBillingHistoryFailure,
  CANCEL_AWAITING_TRANSACTION,
  CancelAwaitingTransactionSuccess,
  CancelAwaitingTransactionFailure,
} from './settings.actions';
import { SettingsService } from 'settings/settings.service';
import { ApiAuthService } from "../../api/auth.service";
import { Action } from "@ngrx/store/store";
import { ShowSuccessSnackbar } from "store/common/common.actions";
import { TRANSACTION_DELETE_SUCCESS } from "common/utilities/messages";


@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private service: SettingsService,
    private authService: ApiAuthService
  ) {
  }

  @Effect()
  getWalletBalanceInterval$: Observable<Action> = this.actions$
    .ofType(GET_CURRENT_BALANCE)
    .switchMap(() => Observable
      .timer(0, 5000)
      .takeUntil(this.actions$.ofType(USER_LOG_OUT_SUCCESS))
      .switchMap(() => this.authService.check()
        .map((res) => new GetCurrentBalanceSuccess(res.adserverWallet.totalFunds))
        .catch(err => Observable.of(new GetCurrentBalanceFailure(err)))
      )
    );

  @Effect()
  getBillingHistory$ = this.actions$
    .ofType(GET_BILLING_HISTORY)
    .map(toPayload)
    .switchMap((payload) => this.service.getBillingHistory(payload.limit, payload.offset)
      .map((data) => new GetBillingHistorySuccess(data))
      .catch(err => Observable.of(new GetBillingHistoryFailure(err))
      )
    );

  @Effect()
  cancelAwaitingTransaction$ = this.actions$
    .ofType(CANCEL_AWAITING_TRANSACTION)
    .map(toPayload)
    .switchMap((payload) => this.service.cancelAwaitingTransaction(payload)
      .switchMap(() => [
        new CancelAwaitingTransactionSuccess(payload),
        new ShowSuccessSnackbar(TRANSACTION_DELETE_SUCCESS),
      ])
      .catch(err => Observable.of(new CancelAwaitingTransactionFailure(err.error.message))
      )
    )
}

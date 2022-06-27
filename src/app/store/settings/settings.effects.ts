import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Observable, of as observableOf, timer as observableTimer } from 'rxjs'
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators'
import { USER_LOG_OUT_SUCCESS } from 'store/auth/auth.actions'
import {
  CANCEL_AWAITING_TRANSACTION,
  CancelAwaitingTransaction,
  CancelAwaitingTransactionSuccess,
  GET_BILLING_HISTORY,
  GET_CURRENT_BALANCE,
  GET_REF_LINKS,
  GetBillingHistory,
  GetBillingHistoryFailure,
  GetBillingHistorySuccess,
  GetCurrentBalanceFailure,
  GetCurrentBalanceSuccess,
  GetRefLinksFailure,
  GetRefLinksSuccess,
} from './settings.actions'
import { SettingsService } from 'settings/settings.service'
import { ApiAuthService } from '../../api/auth.service'
import { Action } from '@ngrx/store'
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions'
import { TRANSACTION_DELETE_SUCCESS } from 'common/utilities/messages'
import { CommonService } from 'common/common.service'

@Injectable()
export class SettingsEffects {
  constructor (
    private actions$: Actions,
    private service: SettingsService,
    private common: CommonService,
    private authService: ApiAuthService
  ) {
  }

  getWalletBalanceInterval$: Observable<Action> = createEffect(() => this.actions$
    .pipe(
      ofType(GET_CURRENT_BALANCE),
      switchMap(() => observableTimer(0, 5000)
        .pipe(
          takeUntil(this.actions$.pipe(ofType(USER_LOG_OUT_SUCCESS))),
          switchMap(() => this.authService.check()
            .pipe(
              map(user => new GetCurrentBalanceSuccess(user)),
              catchError(error => observableOf(new GetCurrentBalanceFailure(error)))
            )
          )
        )
      )
    ))

  getBillingHistory$ = createEffect(() => this.actions$
    .pipe(
      ofType<GetBillingHistory>(GET_BILLING_HISTORY),
      map(action => action.payload),
      switchMap(payload => this.service.getBillingHistory(payload.dateFrom, payload.dateTo, payload.types, payload.limit, payload.offset)
        .pipe(
          map(billingHistory => new GetBillingHistorySuccess(billingHistory)),
          catchError(error => observableOf(new GetBillingHistoryFailure(error))
          )
        )
      )
    ))

  cancelAwaitingTransaction$ = createEffect(() => this.actions$
    .pipe(
      ofType<CancelAwaitingTransaction>(CANCEL_AWAITING_TRANSACTION),
      switchMap(action => this.service.cancelAwaitingTransaction(action.payload)
        .pipe(
          switchMap(() => [
            new CancelAwaitingTransactionSuccess(),
            new ShowSuccessSnackbar(TRANSACTION_DELETE_SUCCESS),
          ]),
          catchError(error => observableOf(new ShowDialogOnError(error.error.message || ''))
          )
        )
      )
    ))

  getRefLinks$ = createEffect(() => this.actions$
    .pipe(
      ofType(GET_REF_LINKS),
      switchMap(() => this.common.getRefLinks()
        .pipe(
          map(refLinks => new GetRefLinksSuccess(refLinks)),
          catchError(error => observableOf(new GetRefLinksFailure(error)))
        )
      )
    ))
}

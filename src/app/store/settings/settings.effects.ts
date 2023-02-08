import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of as observableOf, timer as observableTimer } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { USER_LOG_OUT_SUCCESS } from 'store/auth/auth.actions';
import {
  ADD_ACCESS_TOKEN,
  AddAccessToken,
  AddAccessTokenSuccess,
  CANCEL_AWAITING_TRANSACTION,
  CancelAwaitingTransaction,
  CancelAwaitingTransactionSuccess,
  DELETE_ACCESS_TOKEN,
  DELETE_REF_LINK,
  DeleteAccessToken,
  DeleteAccessTokenSuccess,
  DeleteRefLink,
  DeleteRefLinkSuccess,
  GET_ACCESS_TOKENS,
  GET_BILLING_HISTORY,
  GET_CURRENT_BALANCE,
  GET_REF_LINKS,
  GetAccessTokens,
  GetAccessTokensSuccess,
  GetBillingHistory,
  GetBillingHistoryFailure,
  GetBillingHistorySuccess,
  GetCurrentBalanceFailure,
  GetCurrentBalanceSuccess,
  GetRefLinks,
  GetRefLinksFailure,
  GetRefLinksSuccess,
} from './settings.actions';
import { SettingsService } from 'settings/settings.service';
import { ApiAuthService } from '../../api/auth.service';
import { Action } from '@ngrx/store';
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions';
import { CommonService } from 'common/common.service';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { DELETE_SUCCESS, TRANSACTION_DELETE_SUCCESS } from 'common/utilities/messages';

@Injectable()
export class SettingsEffects {
  constructor(
    private actions$: Actions,
    private service: SettingsService,
    private common: CommonService,
    private authService: ApiAuthService
  ) {}

  getWalletBalanceInterval$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_CURRENT_BALANCE),
      switchMap(() =>
        observableTimer(0, 5000).pipe(
          takeUntil(this.actions$.pipe(ofType(USER_LOG_OUT_SUCCESS))),
          switchMap(() =>
            this.authService.check().pipe(
              map(user => new GetCurrentBalanceSuccess(user)),
              catchError(error => observableOf(new GetCurrentBalanceFailure(error)))
            )
          )
        )
      )
    )
  );

  getBillingHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetBillingHistory>(GET_BILLING_HISTORY),
      map(action => action.payload),
      switchMap(payload =>
        this.service
          .getBillingHistory(payload.dateFrom, payload.dateTo, payload.types, payload.limit, payload.offset)
          .pipe(
            map(billingHistory => new GetBillingHistorySuccess(billingHistory)),
            catchError(error => observableOf(new GetBillingHistoryFailure(error)))
          )
      )
    )
  );

  cancelAwaitingTransaction$ = createEffect(() =>
    this.actions$.pipe(
      ofType<CancelAwaitingTransaction>(CANCEL_AWAITING_TRANSACTION),
      switchMap(action =>
        this.service.cancelAwaitingTransaction(action.payload).pipe(
          switchMap(() => [
            new CancelAwaitingTransactionSuccess(),
            new ShowSuccessSnackbar(TRANSACTION_DELETE_SUCCESS),
          ]),
          catchError(error => observableOf(new ShowDialogOnError(error.error.message || '')))
        )
      )
    )
  );

  getAccessTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetAccessTokens>(GET_ACCESS_TOKENS),
      switchMap(() =>
        this.common.getAccessTokens().pipe(
          map(accessTokens => new GetAccessTokensSuccess(accessTokens)),
          catchError(error => this.handleBackendError(error, 'Token fetch failed'))
        )
      )
    )
  );

  addAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AddAccessToken>(ADD_ACCESS_TOKEN),
      switchMap(action =>
        this.common.addAccessToken(action.payload).pipe(
          map(accessToken => new AddAccessTokenSuccess(accessToken)),
          catchError(error => this.handleBackendError(error, 'Token creation failed'))
        )
      )
    )
  );

  deleteAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType<DeleteAccessToken>(DELETE_ACCESS_TOKEN),
      switchMap(action =>
        this.common.deleteAccessToken(action.payload).pipe(
          map(() => new DeleteAccessTokenSuccess(action.payload)),
          catchError(error => this.handleBackendError(error, 'Token deletion failed'))
        )
      )
    )
  );

  getRefLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType<GetRefLinks>(GET_REF_LINKS),
      switchMap(action =>
        this.common.getRefLinks(action.payload.pageUrl).pipe(
          map(refLinks => new GetRefLinksSuccess(refLinks)),
          catchError(error => observableOf(new GetRefLinksFailure(error)))
        )
      )
    )
  );

  deleteRefLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType<DeleteRefLink>(DELETE_REF_LINK),
      switchMap(action => {
        const refLinkId = action.payload;
        return this.common.deleteRefLink(refLinkId).pipe(
          switchMap(() => [new DeleteRefLinkSuccess(refLinkId), new ShowSuccessSnackbar(DELETE_SUCCESS)]),
          catchError(error => this.handleBackendError(error, 'Deletion failed'))
        );
      })
    )
  );

  private handleBackendError(error, message: string) {
    if (HTTP_INTERNAL_SERVER_ERROR === error.status) {
      return [];
    }
    return observableOf(new ShowDialogOnError(`${message}. Error code: ${error.status}`));
  }
}

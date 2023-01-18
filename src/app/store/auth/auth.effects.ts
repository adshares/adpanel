import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of as observableOf } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SET_USER, SET_USER_SUCCESS, SetUserFailure, SetUserSuccess } from 'store/auth/auth.actions';
import { ApiAuthService } from '../../api/auth.service';
import {
  GET_CURRENT_BALANCE_SUCCESS,
  GetCurrentBalance,
  GetCurrentBalanceSuccess,
} from 'store/settings/settings.actions';
import { SessionService } from '../../session.service';
import { ImpersonationService } from '../../impersonation/impersonation.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private service: ApiAuthService,
    private session: SessionService,
    private impersonation: ImpersonationService
  ) {}

  setUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SET_USER),
      switchMap(() =>
        this.service.check().pipe(
          switchMap(user => {
            return [new SetUserSuccess(user), new GetCurrentBalance()];
          }),
          catchError(() => observableOf(new SetUserFailure()))
        )
      )
    )
  );

  setUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<SetUserSuccess | GetCurrentBalanceSuccess>(SET_USER_SUCCESS, GET_CURRENT_BALANCE_SUCCESS),
        switchMap(action => {
          let user = this.session.getUser();
          if (null === this.impersonation.getTokenFromStorage()) {
            user = { ...user, ...action.payload };
          } else {
            user.referralRefundEnabled = action.payload.referralRefundEnabled;
            user.referralRefundCommission = action.payload.referralRefundCommission;
          }
          this.session.setUser(user);
          return EMPTY;
        })
      ),
    { dispatch: false }
  );
}

import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { Observable } from "rxjs";
import {
  SET_USER, SET_USER_SUCCESS,
  SetUserFailure,
  SetUserSuccess,
} from "store/auth/auth.actions";
import { ApiAuthService } from "../../api/auth.service";
import { User } from "models/user.model";
import {GetCurrentBalance} from "store/settings/settings.actions";
import {Action} from "@ngrx/store";
import {SessionService} from "../../session.service";
import {ImpersonationService} from "../../impersonation/impersonation.service";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private service: ApiAuthService,
    private session: SessionService,
    private impersonation: ImpersonationService,
  ) {
  }

  @Effect()
  setUser$ = this.actions$
    .ofType(SET_USER)
    .switchMap(() => this.service.check()
      .switchMap((user) => {
        return [
          new SetUserSuccess(<User>user),
          new GetCurrentBalance
        ]
      })
      .catch(() => Observable.of(new SetUserFailure()))
    );

  @Effect()
  setUserSuccess$: Observable<Action> = this.actions$
    .ofType(SET_USER_SUCCESS)
    .switchMap((action: SetUserSuccess) => {
        let user = this.session.getUser();
        if (null === this.impersonation.getTokenFromStorage()) {
          user = {...user, ...action.payload};
        } else {
          user.referralRefundEnabled = action.payload.referralRefundEnabled;
          user.referralRefundCommission = action.payload.referralRefundCommission;
        }
        this.session.setUser(user);
        return Observable.of();
      }
    );
}

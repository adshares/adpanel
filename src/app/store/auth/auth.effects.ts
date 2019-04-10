import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { Observable } from "rxjs";
import {
  SET_USER,
  SetUserFailure,
  SetUserSuccess,
} from "store/auth/auth.actions";
import { ApiAuthService } from "../../api/auth.service";
import { User } from "models/user.model";
import { GetCurrentBalance } from "store/settings/settings.actions";

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private service: ApiAuthService,
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
}

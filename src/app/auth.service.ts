import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';

import { isUnixTimePastNow } from 'common/utilities/helpers';
import {AppState} from "models/app-state.model";
import * as authActions from 'store/auth/auth.actions';
import {Store} from "@ngrx/store";

@Injectable()
export class AuthService {

  constructor(
    private router: Router,
    private api: ApiService,
    private session: SessionService,
    private store: Store<AppState>
  ) {
  }

  logout() {
    this.api.auth.logout().subscribe(
      () => {
        this.store.dispatch(new authActions.UserLogOutSuccess());
        this.session.drop();
        this.router.navigate(['/auth', 'login']);
      },
      () => {
        this.store.dispatch(new authActions.UserLogOutSuccess());
        this.session.drop();
        this.router.navigate(['/auth', 'login']);
      }
    );
  }

  timeout() {
    const user = this.session.getUser();
    if (!user) {
      return;
    }
    if (!isUnixTimePastNow(user.expiration)) {
      return;
    }
    this.logout();
  }
}

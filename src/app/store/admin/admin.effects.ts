import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';

import * as adminActions from './admin.actions';
import { AdminService } from 'admin/admin.service';
import { Observable } from "rxjs";

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private service: AdminService,
  ) {
  }

  @Effect()
  loadUsers$ = this.actions$
    .ofType(adminActions.LOAD_USERS)
    .switchMap(() => this.service.getUsers()
      .map((users) => new adminActions.LoadUsersSuccess(users))
      .catch((err) => Observable.of(new adminActions.LoadUsersFailure(err)))
    );

  @Effect()
  loadAdminSettings$ = this.actions$
    .ofType(adminActions.LOAD_ADMIN_SETTINGS)
    .switchMap(() => this.service.getAdminSettings()
      .map((settings) => new adminActions.LoadAdminSettingsSuccess(settings))
      .catch((err) => Observable.of(new adminActions.LoadAdminSettingsFailure(err)))
    );

  @Effect()
  saveAdminSettings$ = this.actions$
    .ofType(adminActions.SET_ADMIN_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setAdminSettings(payload)
      .map(() => {
        return new adminActions.SetAdminSettingsSuccess(payload)})
      .catch(() => Observable.of(new adminActions.SetAdminSettingsFailure(
        'We weren\'t able to save your settings this time. Please, try again later'
      )))
    )
}

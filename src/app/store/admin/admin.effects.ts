import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { AdminService } from 'admin/admin.service';
import { Observable } from "rxjs";
import {
  LoadUsersSuccess,
  LoadUsersFailure,
  LoadAdminSettingsSuccess,
  LoadAdminSettingsFailure,
  SetAdminSettingsSuccess,
  SetAdminSettingsFailure,
  LOAD_USERS,
  LOAD_ADMIN_SETTINGS,
  SET_ADMIN_SETTINGS,
} from './admin.actions';

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private service: AdminService,
  ) {
  }

  @Effect()
  loadUsers$ = this.actions$
    .ofType(LOAD_USERS)
    .switchMap(() => this.service.getUsers())
      .map((users) => new LoadUsersSuccess(users))
      .catch(() => Observable.of(new LoadUsersFailure()))

  @Effect()
  loadAdminSettings$ = this.actions$
    .ofType(LOAD_ADMIN_SETTINGS)
    .switchMap(() => this.service.getAdminSettings()
      .map((settings) => new LoadAdminSettingsSuccess(settings))
      .catch((err) => Observable.of(new LoadAdminSettingsFailure(err)))
    );

  @Effect()
  saveAdminSettings$ = this.actions$
    .ofType(SET_ADMIN_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setAdminSettings(payload)
      .map((settings) => new SetAdminSettingsSuccess(settings))
      .catch(() => Observable.of(new SetAdminSettingsFailure(
        'We weren\'t able to save your settings this time. Please, try again later'
      )))
    )
}

import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import {
  LOAD_USERS,
  LOAD_ADMIN_SETTINGS,
  SET_ADMIN_SETTINGS,
  LoadUsersSuccess,
  LoadAdminSettingsSuccess,
  SetAdminSettingsSuccess,
  SetAdminSettingsFailure
} from './admin.actions';
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
    .ofType(LOAD_USERS)
    .switchMap(() => this.service.getUsers())
    .map((users) => new LoadUsersSuccess(users));

  @Effect()
  loadAdminSettings$ = this.actions$
    .ofType(LOAD_ADMIN_SETTINGS)
    .switchMap(() => this.service.getAdminSettings())
    .map((settings) => new LoadAdminSettingsSuccess(settings));

  @Effect()
  setAdminSettings$ = this.actions$
    .ofType(SET_ADMIN_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setAdminSettings(payload)
      .map((newSettings)=> new SetAdminSettingsSuccess(newSettings))
      .catch(() => Observable.of(new SetAdminSettingsFailure(
        `We weren't able to save your settings. Please, try again later`
      )))
    )
}

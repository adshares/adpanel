import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import {
  LOAD_USERS,
  LOAD_ADMIN_SETTINGS,
  SET_ADMIN_SETTINGS,
  LoadUsersSuccess,
  LoadUsersFailure,
  LoadAdminSettingsSuccess,
  LoadAdminSettingsFailure,
  SetAdminSettingsSuccess,
  SetAdminSettingsFailure,
} from './admin.actions';
import { AdminService } from 'admin/admin.service';
import { Observable } from "rxjs";
import { ClickToADSPipe } from "common/pipes/adshares-token.pipe";

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private service: AdminService,
    private clickToADSPipe: ClickToADSPipe
  ) {
  }

  @Effect()
  loadUsers$ = this.actions$
    .ofType(LOAD_USERS)
    .switchMap(() => this.service.getUsers()
      .map((users) => new LoadUsersSuccess(users))
      .catch((err) => Observable.of(new LoadUsersFailure(err)))
    );

  @Effect()
  loadAdminSettings$ = this.actions$
    .ofType(LOAD_ADMIN_SETTINGS)
    .switchMap(() => this.service.getAdminSettings()
      .map((response) => {
        return {
          settings: {
            ...response.settings,
            hotwalletMaxValue: this.clickToADSPipe.transform(response.settings.hotwalletMaxValue),
            hotwalletMinValue: this.clickToADSPipe.transform(response.settings.hotwalletMinValue),
          }
        }
      })
      .map((settings) => new LoadAdminSettingsSuccess(settings))
      .catch((err) => Observable.of(new LoadAdminSettingsFailure(err)))
    );

  @Effect()
  saveAdminSettings$ = this.actions$
    .ofType(SET_ADMIN_SETTINGS)
    .map(toPayload)
    .switchMap((payload) => this.service.setAdminSettings(payload)
      .map(() => new SetAdminSettingsSuccess(payload))
      .catch(() => Observable.of(new SetAdminSettingsFailure(
        'We weren\'t able to save your settings this time. Please, try again later'
      )))
    )
}

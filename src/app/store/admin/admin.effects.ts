import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';

import * as adminActions from './admin.action';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class AdminEffects {
  constructor(
    private actions$: Actions,
    private service: AdminService,
  ) { }

  @Effect()
  loadUsers$ = this.actions$
    .ofType(adminActions.LOAD_USERS)
    .switchMap((action) => this.service.getUsers())
    .map((users) => new adminActions.LoadUsersSuccess(users));

  @Effect()
  loadAdminSettings$ = this.actions$
    .ofType(adminActions.LOAD_ADMIN_SETTINGS)
    .switchMap((action) => this.service.getAdminSettings())
    .map((settings) => new adminActions.LoadAdminSettingsSuccess(settings));
}

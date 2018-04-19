import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';

import { CommonService } from 'common/common.service';
import * as commonActions from './common.actions';

@Injectable()
export class CommonEffects {
  constructor(
    private actions$: Actions,
    private service: CommonService
  ) {}

  @Effect()
  loadNotifications = this.actions$
    .ofType(commonActions.LOAD_NOTIFICATIONS)
    .switchMap((payload) => this.service.getNotifications())
    .map((notifications) => new commonActions.LoadNotificationsSuccess(notifications));
}

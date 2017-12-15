import {Injectable} from '@angular/core';
import {Effect, Actions} from '@ngrx/effects';

import * as settingsActions from './settings.actions';
import { SettingsService } from './settings.service';

import 'rxjs/add/operator/switchMap';

@Injectable()
export class SettingsEffects {
  constructor (
    private actions$: Actions,
    private service: SettingsService
  ) {}

  @Effect()
  loadBillingHistory$ = this.actions$
    .ofType(settingsActions.LOAD_BILLING_HISTORY)
    .map((action: settingsActions.LoadBillingHistory) => action.payload )
    .switchMap(() => this.service.getBillingHistory())
    .map((billingHistory) => {
      return new settingsActions.LoadBillingHistorySuccess(billingHistory);
    });
}

import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import * as advertiserActions from './advertiser.actions';
import { AdvertiserService } from '../../advertiser/advertiser.service';
import { AppState } from '../../models/app-state.model';

@Injectable()
export class AdvertiserEffects {
  constructor(
    private actions$: Actions,
    private service: AdvertiserService,
    private store: Store<AppState>
  ) { }

  @Effect()
  loadCampaigns$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS)
    .withLatestFrom(this.store.select('state', 'user', 'data', 'id'))
    .switchMap(([action, userId]) => this.service.getCampaigns(userId))
    .map((campaigns) => new advertiserActions.LoadCampaignsSuccess(campaigns));
}

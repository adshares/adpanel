import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import * as advertiserActions from './advertiser.action';
import { AdvertiserService } from '../../advertiser/advertiser.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class AdvertiserEffects {
  constructor (
    private actions$: Actions,
    private service: AdvertiserService
  ) { }

  @Effect()
  loadCampaigns$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS)
    .map((action: advertiserActions.LoadCampaigns) => action.payload)
    .switchMap(() => this.service.getCampaigns())
    .map((campaigns) => {
      return new advertiserActions.LoadCampaignsSuccess(campaigns);
    });
}

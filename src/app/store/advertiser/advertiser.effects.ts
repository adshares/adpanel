import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';

import * as advertiserActions from './advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';

@Injectable()
export class AdvertiserEffects {
  constructor(
    private actions$: Actions,
    private service: AdvertiserService
  ) { }

  @Effect()
  loadCampaigns$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaigns(payload))
    .map((campaigns) => new advertiserActions.LoadCampaignsSuccess(campaigns));

  @Effect()
  addCampaignToCampaigns = this.actions$
    .ofType(advertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.saveCampaign(payload))
    .map((campaign) => new advertiserActions.LoadCampaignsSuccess(campaign));
}

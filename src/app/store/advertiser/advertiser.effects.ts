import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import * as advertiserActions from './advertiser.actions';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { PushNotificationsService } from 'common/components/push-notifications/push-notifications.service';

@Injectable()
export class AdvertiserEffects {
  constructor(
    private actions$: Actions,
    private service: AdvertiserService,
    private pushNotificationsService: PushNotificationsService
  ) {
  }

  @Effect()
  loadCampaigns$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaigns())
    .map((campaigns) => new advertiserActions.LoadCampaignsSuccess(campaigns));

  @Effect()
  loadCampaignsTotals$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaignsTotals(payload))
    .map((campaignsTotals) => new advertiserActions.LoadCampaignsTotalsSuccess(campaignsTotals));

  @Effect()
  addCampaignToCampaigns = this.actions$
    .ofType(advertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.saveCampaign(payload))
    .map((campaign) => new advertiserActions.AddCampaignToCampaignsSuccess(campaign));
}

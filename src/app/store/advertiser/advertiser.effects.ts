import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import * as advertiserActions from './advertiser.actions';
import {AdvertiserService} from 'advertiser/advertiser.service';
import {PushNotificationsService} from 'common/components/push-notifications/push-notifications.service';
import {formatMoney} from "common/utilities/helpers";
import {of} from "rxjs/observable/of";

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
    .switchMap(() => this.service.getCampaigns())
    .map((campaigns) => new advertiserActions.LoadCampaignsSuccess(campaigns));

  @Effect()
  loadCampaignBannersData$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGN_BANNER_DATA)
    .map(toPayload)
    .switchMap((payload) => {
      return this.service.getCampaignsTotals(`${payload.from}`, `${payload.to}`, payload.id)
    })
    .map((banners) => {
      return new advertiserActions.LoadCampaignBannerDataSuccess(banners)
    });

  @Effect()
  loadCampaignsTotals$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS_TOTALS)
    .map(toPayload)
    .switchMap((payload) => {
      return this.service.getCampaignsTotals(`${payload.from}`, `${payload.to}`)
    })
    .map((campaignsTotals) => new advertiserActions.LoadCampaignsTotalsSuccess(campaignsTotals));

  @Effect()
  addCampaignToCampaigns = this.actions$
    .ofType(advertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.saveCampaign(payload))
    .map((campaign) => new advertiserActions.AddCampaignToCampaignsSuccess(campaign));

  @Effect()
  updateCampaign = this.actions$
    .ofType(advertiserActions.UPDATE_CAMPAIGN)
    .map(toPayload)
    .map(payload => new advertiserActions.UpdateCampaignSuccess(payload))
    // .map(() => new advertiserActions.ClearLastEditedCampaign())

}

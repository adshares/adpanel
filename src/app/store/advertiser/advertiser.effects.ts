import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {AdvertiserService} from 'advertiser/advertiser.service';
import {Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';
import * as advertiserActions from './advertiser.actions';
import * as authActions from 'store/auth/auth.actions';

import "rxjs/add/operator/take";
import * as moment from "moment";

@Injectable()
export class AdvertiserEffects {
  constructor(
    private actions$: Actions,
    private service: AdvertiserService,
    private router: Router,
  ) {
  }

  @Effect()
  loadCampaigns$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaigns()
      .switchMap((campaigns) => {
        return Observable.from([
          new advertiserActions.LoadCampaignsSuccess(campaigns),
          new advertiserActions.LoadCampaignsTotals({from: payload.from, to: payload.to})])
      })
      .catch(() => Observable.of(new advertiserActions.LoadCampaignsFailure()))
    );

  @Effect()
  loadCampaignsTotals$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS_TOTALS)
    .map(toPayload)
    .switchMap((payload) => {
      const from = moment(payload.from).format();
      const to = moment(payload.to).format();

      return this.service.getCampaignsTotals(
      `${from}`, `${to}`)
      .map((campaignsTotals) => new advertiserActions.LoadCampaignsTotalsSuccess(campaignsTotals))
      .catch(() => Observable.of(new advertiserActions.LoadCampaignsTotalsFailure()))
    });

  @Effect()
  loadCampaign$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGN)
    .map(toPayload)
    .switchMap((id) => this.service.getCampaign(id)
      .switchMap((payload) => {
        const from = moment().subtract(30, 'd').format();
        const to = moment().format();
        const campaign = payload.campaign;
        return [
          new advertiserActions.LoadCampaignSuccess(campaign),
          new advertiserActions.LoadCampaignTotals({from, to, id: campaign.id})
        ]
      })
      .catch(() => Observable.of(new advertiserActions.LoadCampaignFailure()))
    );

  @Effect()
  loadCampaignTotals$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGN_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service
      .getCampaignsTotals(`${payload.from}`, `${payload.to}`, payload.id)
      .map((data) => new advertiserActions.LoadCampaignTotalsSuccess(data))
      .catch(() => Observable.of(new advertiserActions.LoadCampaignTotalsFailure()))
    );

  @Effect()
  addCampaignToCampaigns = this.actions$
    .ofType(advertiserActions.ADD_CAMPAIGN_TO_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.saveCampaign(payload)
      .map((campaign) => new advertiserActions.AddCampaignToCampaignsSuccess(campaign))
      .catch(() => Observable.of(new advertiserActions.AddCampaignToCampaignsFailure()))
    );

  @Effect()
  updateCampaign = this.actions$
    .ofType(advertiserActions.UPDATE_CAMPAIGN)
    .map(toPayload)
    .switchMap((payload) => this.service.updateCampaign(payload)
      .switchMap(() => {
        this.router.navigate(['/advertiser', 'campaign', payload.id]);
        return [
          new advertiserActions.UpdateCampaignSuccess(payload),
          new advertiserActions.ClearLastEditedCampaign(),
        ];
      })
      .catch((err) => {
        return Observable.of(new advertiserActions.UpdateCampaignFailure(err)
        )
      })
    );

  @Effect()
  updateCampaignStatus = this.actions$
    .ofType(advertiserActions.UPDATE_CAMPAIGN_STATUS)
    .map(toPayload)
    .switchMap((payload) => this.service.updateStatus(payload.id, payload.status)
      .map(() => new advertiserActions.UpdateCampaignStatusSuccess(payload))
      .catch((err) => {
        return Observable.of(new advertiserActions.UpdateCampaignStatusFailure(err)
        )
      })
    );
}

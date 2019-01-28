import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {AdvertiserService} from 'advertiser/advertiser.service';
import {Router} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs/Observable';
import * as advertiserActions from './advertiser.actions';
import "rxjs/add/operator/take";

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
    .switchMap(() => this.service.getCampaigns()
      .switchMap((campaigns) => Observable.of([new advertiserActions.LoadCampaignsSuccess(campaigns),
      new advertiserActions.LoadCampaignsTotals({from, to})]))
      .catch(() => Observable.of(new advertiserActions.LoadCampaignsFailure()))
    );

  @Effect()
  loadCampaignBannersData$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGN_BANNER_DATA)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaignsTotals(`${payload.from}`, `${payload.to}`, payload.id)
      .map((banners) => {
        return new advertiserActions.LoadCampaignBannerDataSuccess(banners)})
      .catch(() => Observable.of(new advertiserActions.LoadCampaignBannerDataFailure()))
    );

  @Effect()
  loadCampaignsTotals$ = this.actions$
    .ofType(advertiserActions.LOAD_CAMPAIGNS_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaignsTotals(`${payload.from}`, `${payload.to}`)
      .map((campaignsTotals) => new advertiserActions.LoadCampaignsTotalsSuccess(campaignsTotals))
      .catch(() => Observable.of(new advertiserActions.AddCampaignToCampaignsFailure()))
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
        return Observable.of(new advertiserActions.UpdateCampaignFailure()
        )
      })
    )

}

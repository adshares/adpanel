import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { Router } from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import {
  LOAD_CAMPAIGNS,
  LOAD_CAMPAIGNS_TOTALS,
  LOAD_CAMPAIGN,
  LOAD_CAMPAIGN_TOTALS,
  ADD_CAMPAIGN_TO_CAMPAIGNS,
  UPDATE_CAMPAIGN,
  UPDATE_CAMPAIGN_STATUS,
  DELETE_CAMPAIGN,
  LoadCampaignsSuccess,
  LoadCampaignsTotals,
  LoadCampaignsFailure,
  LoadCampaignsTotalsSuccess,
  LoadCampaignsTotalsFailure,
  LoadCampaignSuccess,
  LoadCampaignTotals,
  LoadCampaignTotalsSuccess,
  LoadCampaignTotalsFailure,
  AddCampaignToCampaignsSuccess,
  AddCampaignToCampaignsFailure,
  UpdateCampaignSuccess,
  ClearLastEditedCampaign,
  UpdateCampaignFailure,
  UpdateCampaignStatusSuccess,
  UpdateCampaignStatusFailure,
  DeleteCampaignSuccess,
  DeleteCampaignFailure,
  LoadCampaignFailure,
} from './advertiser.actions';

import "rxjs/add/operator/take";
import * as moment from "moment";
import { MatDialog } from "@angular/material";
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { WarningDialogComponent } from "common/dialog/warning-dialog/warning-dialog.component";
import { adjustCampaignStatus } from "common/utilities/helpers";

// averageCpc: 1685956922.7895
// averageCpm: 1042000
// bannerId: 6762
// bannerName: "aa"
// campaignId: 3458
// clicks: 210
// cost: 352364998947
// ctr: 0.5
// impressions: 2

@Injectable()
export class AdvertiserEffects {
  currentDate = moment(new Date());

  constructor(
    private actions$: Actions,
    private service: AdvertiserService,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  @Effect()
  loadCampaigns$ = this.actions$
    .ofType(LOAD_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaigns()
      .switchMap((response) => {
        const campaigns = response.map((campaign) => {
          return {
            ...campaign,
            basicInformation: {
              ...campaign.basicInformation,
              status: adjustCampaignStatus(campaign.basicInformation, this.currentDate)
            }
          }
        });
        return Observable.from([
          new LoadCampaignsSuccess(campaigns),
          new LoadCampaignsTotals({from: payload.from, to: payload.to})])
      })
      .catch(() => Observable.of(new LoadCampaignsFailure()))
    );

  @Effect()
  loadCampaignsTotals$ = this.actions$
    .ofType(LOAD_CAMPAIGNS_TOTALS)
    .map(toPayload)
    .switchMap((payload) => {
      const from = moment(payload.from).format();
      const to = moment(payload.to).format();

      return this.service.getCampaignsTotals(
        `${from}`, `${to}`)
        .map((campaignsTotals) => new LoadCampaignsTotalsSuccess(campaignsTotals))
        .catch(() => Observable.of(new LoadCampaignsTotalsFailure()))
    });

  @Effect()
  loadCampaign$ = this.actions$
    .ofType(LOAD_CAMPAIGN)
    .map(toPayload)
    .switchMap((id) => this.service.getCampaign(id)
      .switchMap((payload) => {
        const from = moment().subtract(30, 'd').format();
        const to = this.currentDate.format();
        const campaign = {
          ...payload.campaign,
          basicInformation: {
            ...payload.campaign.basicInformation,
            status: adjustCampaignStatus(payload.campaign.basicInformation, this.currentDate)
          }
        };

        return [
          new LoadCampaignSuccess(campaign),
          new LoadCampaignTotals({from, to, id: campaign.id})
        ]
      })
      .catch(() => Observable.of(new LoadCampaignFailure()))
    );

  @Effect()
  loadCampaignTotals$ = this.actions$
    .ofType(LOAD_CAMPAIGN_TOTALS)
    .map(toPayload)
    .switchMap((payload) => this.service.getCampaignsTotals(`${payload.from}`, `${payload.to}`, payload.id)
      .map((dataArray) => {
        const formattedBannerTotals = dataArray.data.map(data => {
          return {
            clicks: data.clicks,
            impressions: data.impressions,
            ctr: data.ctr,
            averageCpc: data.averageCpc,
            averageCpm: data.averageCpm,
            cost: data.cost,
            id: data.bannerId,
            name: data.bannerName,
          }
        });
        const totals = {
          ...dataArray,
          data: formattedBannerTotals
        };
        return new LoadCampaignTotalsSuccess(totals)
      })
      .catch((err) =>{console.log(err)
        return Observable.of(new LoadCampaignTotalsFailure())})
    );

  @Effect()
  addCampaignToCampaigns = this.actions$
    .ofType(ADD_CAMPAIGN_TO_CAMPAIGNS)
    .map(toPayload)
    .switchMap((payload) => this.service.saveCampaign(payload)
      .switchMap((campaign) => {
        if (payload.basicInformation.status !== campaign.basicInformation.status) {
          this.dialog.open(WarningDialogComponent, {
            data: {
              title: `Warning`,
              message: `Campaign '${campaign.basicInformation.name}' couldn't be automatically activated. \n
                 Please check if you have enough money on your account and activate campaign manually. `,
            }
          });
        }
        this.router.navigate(['/advertiser', 'dashboard']);
        return [
          new AddCampaignToCampaignsSuccess(campaign),
          new ClearLastEditedCampaign(),
        ]
      })
      .catch(() => Observable.of(new AddCampaignToCampaignsFailure()))
    );

  @Effect()
  updateCampaign = this.actions$
    .ofType(UPDATE_CAMPAIGN)
    .map(toPayload)
    .switchMap((payload) => this.service.updateCampaign(payload)
      .switchMap(() => {
        this.router.navigate(['/advertiser', 'campaign', payload.id]);
        return [
          new UpdateCampaignSuccess(payload),
          new ClearLastEditedCampaign(),
        ];
      })
      .catch((err) => {
        return Observable.of(new UpdateCampaignFailure(err)
        )
      })
    );

  @Effect()
  updateCampaignStatus = this.actions$
    .ofType(UPDATE_CAMPAIGN_STATUS)
    .map(toPayload)
    .switchMap((payload) => this.service.updateStatus(payload.id, payload.status)
      .map(() => new UpdateCampaignStatusSuccess(payload))
      .catch((err) => {
        if (err.status === HTTP_INTERNAL_SERVER_ERROR) return Observable.of(null);
        let errorMsg;
        if (err.status === HTTP_BAD_REQUEST) {
          errorMsg = 'We weren\'t able to activate given campaign. \n ' +
            'Please check if you have enough money on your account.'
        } else {
          errorMsg = err.error.errors[0] || err.message;
        }
        return Observable.of(new UpdateCampaignStatusFailure(errorMsg)
        )
      })
    );

  @Effect()
  deleteCampaign = this.actions$
    .ofType(DELETE_CAMPAIGN)
    .map(toPayload)
    .switchMap((payload) => this.service.deleteCampaign(payload)
      .map(() => {
        this.router.navigate(['/advertiser', 'dashboard']);
        return new DeleteCampaignSuccess(payload)
      })
      .catch(() => {
        return Observable.of(new DeleteCampaignFailure(
          `Given campaign cannot be deleted at this moment. Please try again later.`)
        )
      })
    );
}

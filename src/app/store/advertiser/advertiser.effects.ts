import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from 'rxjs/Observable';
import {
  ACTIVATE_OUTDATED_CAMPAIGN,
  ActivateOutdatedCampaignStatus,
  ActivateOutdatedCampaignStatusSuccess,
  ADD_CAMPAIGN_TO_CAMPAIGNS, ADD_CAMPAIGN_TO_CAMPAIGNS_SUCCESS,
  AddCampaignToCampaignsFailure,
  AddCampaignToCampaignsSuccess,
  ClearLastEditedCampaign,
  CLONE_CAMPAIGN, CLONE_CAMPAIGN_SUCCESS,
  CloneCampaignFailure,
  CloneCampaignSuccess,
  DELETE_CAMPAIGN,
  DeleteCampaignFailure,
  DeleteCampaignSuccess,
  LOAD_CAMPAIGN,
  LOAD_CAMPAIGN_TOTALS,
  LOAD_CAMPAIGNS,
  LOAD_CAMPAIGNS_CONFIG,
  LOAD_CAMPAIGNS_TOTALS,
  LoadCampaignFailure,
  LoadCampaignsConfig,
  LoadCampaignsConfigFailure,
  LoadCampaignsConfigSuccess,
  LoadCampaignsFailure,
  LoadCampaignsSuccess,
  LoadCampaignsTotals,
  LoadCampaignsTotalsFailure,
  LoadCampaignsTotalsSuccess,
  LoadCampaignSuccess,
  LoadCampaignTotalsFailure,
  LoadCampaignTotalsSuccess,
  SAVE_CONVERSION,
  UPDATE_CAMPAIGN,
  UPDATE_CAMPAIGN_STATUS,
  UpdateCampaignFailure,
  UpdateCampaignStatus,
  UpdateCampaignStatusSuccess,
  UpdateCampaignSuccess,
} from './advertiser.actions'
import { ShowSuccessSnackbar } from '../common/common.actions';
import * as moment from 'moment';
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { SAVE_SUCCESS, STATUS_SAVE_SUCCESS } from 'common/utilities/messages';
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component';
import { adjustCampaignStatus, validCampaignBudget } from 'common/utilities/helpers';
import { AppState } from 'models/app-state.model';
import { Campaign, CampaignsConfig } from 'models/campaign.model';
import { User } from 'models/user.model';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { of } from 'rxjs/observable/of'
import { getSortHeaderNotContainedWithinSortError } from '@angular/material/sort/typings/sort-errors'

@Injectable()
export class AdvertiserEffects {
  currentDate = moment(new Date());

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private service: AdvertiserService,
    private router: Router,
    private route: ActivatedRoute,
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
          new LoadCampaignsConfig(),
          new LoadCampaignsTotals({from: payload.from, to: payload.to})
        ])
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
        const campaign = {
          ...payload.campaign,
          basicInformation: {
            ...payload.campaign.basicInformation,
            status: adjustCampaignStatus(payload.campaign.basicInformation, this.currentDate)
          }
        };
        return Observable.from([
          new LoadCampaignSuccess(campaign),
          new LoadCampaignsConfig(),
        ]);
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
      .catch((err) => {
        return Observable.of(new LoadCampaignTotalsFailure())
      })
    );

  @Effect()
  loadCampaignsConfig$ = this.actions$
    .ofType(LOAD_CAMPAIGNS_CONFIG)
    .switchMap(() => this.service.getCampaignsConfig()
      .map((payload) => new LoadCampaignsConfigSuccess(<CampaignsConfig>payload))
      .catch(() => Observable.of(new LoadCampaignsConfigFailure()))
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
        return Observable.of(new UpdateCampaignFailure(`An error occurred. Error code: ${err.status}`)
        )
      })
    );

  @Effect()
  saveConversion = this.actions$
    .ofType(SAVE_CONVERSION)
    .map(toPayload)
    .switchMap((payload) => this.service.updateCampaign(payload)
      .switchMap(() => {
        return [
          new UpdateCampaignSuccess(payload),
          new ShowSuccessSnackbar(SAVE_SUCCESS),
        ];
      })
      .catch((err) => {
        return Observable.of(new UpdateCampaignFailure(`An error occurred. Error code: ${err.status}`)
        )
      })
    );

  @Effect()
  updateCampaignStatus = this.actions$
    .ofType(UPDATE_CAMPAIGN_STATUS)
    .withLatestFrom(this.store$.select('state', 'user', 'data'))
    .withLatestFrom(this.store$.select('state', 'advertiser'), ([action, user], state) => {
      const payload = (<UpdateCampaignStatus>action).payload;
      return new Array<[any, CampaignsConfig, Campaign, User]>([
        payload,
        state.campaignsConfig,
        state.campaigns.find(campaign => campaign.id === payload.id),
        user
      ]);
    })
    .switchMap(([[payload, config, campaign, user]]) => {
      return this.service.updateStatus(payload.id, payload.status)
        .switchMap(() => [
            new UpdateCampaignStatusSuccess(payload),
            new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)
          ]
        )
        .catch((err) => {
          if (err.status === HTTP_INTERNAL_SERVER_ERROR) {
            return [];
          }

          function isCampaignOutdated() {

            return campaign.basicInformation.dateEnd
              && (moment(new Date()) > moment(campaign.basicInformation.dateEnd));
          }

          let errorMsg;
          if (err.status === HTTP_BAD_REQUEST) {
            const errors = validCampaignBudget(config, campaign, user);

            if ((errors.length == 1) && isCampaignOutdated()) {
              this.dialog.open(UserConfirmResponseDialogComponent, {
                data: {
                  title: 'The campaign is outdated',
                  message: "To make it active you should unset end date or change to a future date.\nDo you want to unset the campaign's end date?",
                }
              })
                .afterClosed()
                .subscribe(result => {
                    if (result) {
                      this.store$.dispatch(
                        new ActivateOutdatedCampaignStatus({campaignId: payload.id})
                      );
                    }
                  }
                );

              return [];
            }

            if (errors.length == 0) {
              errors.push('Please check if you have enough money on your account.');
            }
            errorMsg = 'We weren\'t able to activate given campaign.\n' + errors.join('\n');
          } else {
            errorMsg = err.error.errors[0] || err.message;
          }

          return Observable.of(new UpdateCampaignFailure(errorMsg));
        });
    });

  @Effect()
  activateOutdatedCampaign = this.actions$
    .ofType(ACTIVATE_OUTDATED_CAMPAIGN)
    .withLatestFrom(this.store$.select('state', 'user', 'data'))
    .withLatestFrom(this.store$.select('state', 'advertiser'), ([action, user], state) => {
      const payload = (<ActivateOutdatedCampaignStatus>action).payload;
      return new Array<[any, CampaignsConfig, Campaign, User]>([
        payload,
        state.campaignsConfig,
        state.campaigns.find(campaign => campaign.id === payload.campaignId),
        user
      ]);
    })
    .switchMap(([[payload, config, campaign, user]]) => {
      return this.service.activateOutdatedCampaign(payload.campaignId)
        .switchMap(() => [
            new ActivateOutdatedCampaignStatusSuccess(payload),
            new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)
          ]
        )
        .catch((err) => {
          if (err.status === HTTP_INTERNAL_SERVER_ERROR) {
            return [];
          }
          let errorMsg;
          if (err.status === HTTP_BAD_REQUEST) {
            const errors = validCampaignBudget(config, campaign, user);
            if (errors.length == 0) {
              errors.push('Please check if you have enough money on your account.');
            }
            errorMsg = 'We weren\'t able to activate given campaign.\n' + errors.join('\n');
          } else {
            errorMsg = err.error.errors[0] || err.message;
          }

          return Observable.of(new UpdateCampaignFailure(errorMsg));
        });
    });

  @Effect()
  cloneCampaign = this.actions$
    .ofType(CLONE_CAMPAIGN)
    .map(toPayload)
    .switchMap((payload) => this.service.cloneCampaign(payload)
      .switchMap((campaign) => {
        this.router.navigate(['/advertiser', 'dashboard']);
        return [
          new CloneCampaignSuccess(campaign),
          new AddCampaignToCampaignsSuccess(campaign),
          new ClearLastEditedCampaign(),
        ]
      })
      .catch(() => {
        return Observable.of(new CloneCampaignFailure(
          `Given campaign cannot be cloned at this moment. Please try again later.`)
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

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AdvertiserService } from 'advertiser/advertiser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { from as observableFrom, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  ACTIVATE_OUTDATED_CAMPAIGN,
  ActivateOutdatedCampaignStatus,
  ActivateOutdatedCampaignStatusSuccess,
  ADD_CAMPAIGN_TO_CAMPAIGNS,
  AddCampaignToCampaigns,
  AddCampaignToCampaignsSuccess,
  ClearLastEditedCampaign,
  CLONE_CAMPAIGN,
  CloneCampaign,
  CloneCampaignFailure,
  CloneCampaignSuccess,
  DELETE_CAMPAIGN,
  DeleteCampaign,
  DeleteCampaignSuccess,
  LOAD_CAMPAIGN,
  LOAD_CAMPAIGN_TOTALS,
  LOAD_CAMPAIGNS,
  LOAD_CAMPAIGNS_CONFIG,
  LOAD_CAMPAIGNS_TOTALS,
  LoadCampaign,
  LoadCampaignFailure,
  LoadCampaigns,
  LoadCampaignsConfig,
  LoadCampaignsConfigFailure,
  LoadCampaignsConfigSuccess,
  LoadCampaignsFailure,
  LoadCampaignsSuccess,
  LoadCampaignsTotals,
  LoadCampaignsTotalsFailure,
  LoadCampaignsTotalsSuccess,
  LoadCampaignSuccess,
  LoadCampaignTotals,
  LoadCampaignTotalsFailure,
  LoadCampaignTotalsSuccess,
  SAVE_CONVERSION,
  SaveConversion,
  UPDATE_CAMPAIGN,
  UPDATE_CAMPAIGN_STATUS,
  UpdateCampaign,
  UpdateCampaignFailure,
  UpdateCampaignStatus,
  UpdateCampaignStatusSuccess,
  UpdateCampaignSuccess,
} from './advertiser.actions';
import { ShowDialogOnError, ShowSuccessSnackbar } from '../common/common.actions';
import * as moment from 'moment';
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_UNPROCESSABLE_ENTITY } from 'common/utilities/codes';
import { SAVE_SUCCESS, STATUS_SAVE_SUCCESS } from 'common/utilities/messages';
import { WarningDialogComponent } from 'common/dialog/warning-dialog/warning-dialog.component';
import { adjustCampaignStatus, validCampaignBudget } from 'common/utilities/helpers';
import { AppState } from 'models/app-state.model';
import { Campaign, CampaignsConfig } from 'models/campaign.model';
import { User } from 'models/user.model';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';

@Injectable()
export class AdvertiserEffects {
  currentDate = moment(new Date());

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private service: AdvertiserService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  loadCampaigns$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadCampaigns>(LOAD_CAMPAIGNS),
      switchMap(action =>
        this.service.getCampaigns(action.payload.filter).pipe(
          switchMap(response => {
            const campaigns = response.map(campaign => {
              return {
                ...campaign,
                basicInformation: {
                  ...campaign.basicInformation,
                  status: adjustCampaignStatus(campaign.basicInformation, this.currentDate),
                },
              };
            });
            return observableFrom([
              new LoadCampaignsSuccess(campaigns),
              new LoadCampaignsConfig(),
              new LoadCampaignsTotals({
                from: action.payload.from,
                to: action.payload.to,
                filter: action.payload.filter,
              }),
            ]);
          }),
          catchError(() => observableOf(new LoadCampaignsFailure()))
        )
      )
    )
  );

  loadCampaignsTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadCampaignsTotals>(LOAD_CAMPAIGNS_TOTALS),
      map(action => action.payload),
      switchMap(payload => {
        const from = moment(payload.from).format();
        const to = moment(payload.to).format();

        return this.service.getCampaignsTotals(from, to, undefined, payload.filter).pipe(
          map(campaignsTotals => new LoadCampaignsTotalsSuccess(campaignsTotals)),
          catchError(() => observableOf(new LoadCampaignsTotalsFailure()))
        );
      })
    )
  );

  loadCampaign$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadCampaign>(LOAD_CAMPAIGN),
      map(action => action.payload),
      switchMap(id =>
        this.service.getCampaign(id).pipe(
          switchMap(payload => {
            const campaign = {
              ...payload.campaign,
              basicInformation: {
                ...payload.campaign.basicInformation,
                status: adjustCampaignStatus(payload.campaign.basicInformation, this.currentDate),
              },
            };
            return observableFrom([new LoadCampaignSuccess(campaign), new LoadCampaignsConfig()]);
          }),
          catchError(() => observableOf(new LoadCampaignFailure()))
        )
      )
    )
  );

  loadCampaignTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadCampaignTotals>(LOAD_CAMPAIGN_TOTALS),
      map(action => action.payload),
      switchMap(payload =>
        this.service.getCampaignsTotals(`${payload.from}`, `${payload.to}`, payload.id).pipe(
          map(dataArray => {
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
              };
            });
            const totals = {
              ...dataArray,
              data: formattedBannerTotals,
            };
            return new LoadCampaignTotalsSuccess(totals);
          }),
          catchError(() => {
            return observableOf(new LoadCampaignTotalsFailure());
          })
        )
      )
    )
  );

  loadCampaignsConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_CAMPAIGNS_CONFIG),
      switchMap(() =>
        this.service.getCampaignsConfig().pipe(
          map(payload => new LoadCampaignsConfigSuccess(<CampaignsConfig>payload)),
          catchError(() => observableOf(new LoadCampaignsConfigFailure()))
        )
      )
    )
  );

  addCampaignToCampaigns = createEffect(() =>
    this.actions$.pipe(
      ofType<AddCampaignToCampaigns>(ADD_CAMPAIGN_TO_CAMPAIGNS),
      map(action => action.payload),
      switchMap(payload =>
        this.service.saveCampaign(payload).pipe(
          switchMap(campaign => {
            if (payload.basicInformation.status !== campaign.basicInformation.status) {
              this.dialog.open(WarningDialogComponent, {
                data: {
                  title: `Warning`,
                  message: `Campaign '${campaign.basicInformation.name}' couldn't be automatically activated. \n
                 Please check if you have enough money on your account and activate campaign manually. `,
                },
              });
            }
            this.router.navigate(['/advertiser', 'dashboard']);
            return [new AddCampaignToCampaignsSuccess(campaign), new ClearLastEditedCampaign()];
          }),
          catchError(error =>
            observableOf(new ShowDialogOnError((error.error && error.error.message) || `Error code: ${error.status}`))
          )
        )
      )
    )
  );

  updateCampaign = createEffect(() =>
    this.actions$.pipe(
      ofType<UpdateCampaign>(UPDATE_CAMPAIGN),
      map(action => action.payload),
      switchMap(payload =>
        this.service.updateCampaign(payload).pipe(
          switchMap(() => {
            this.router.navigate(['/advertiser', 'campaign', payload.id]);
            return [new UpdateCampaignSuccess(payload), new ClearLastEditedCampaign()];
          }),
          catchError(error => {
            return observableOf(new UpdateCampaignFailure(`An error occurred. Error code: ${error.status}`));
          })
        )
      )
    )
  );

  saveConversion = createEffect(() =>
    this.actions$.pipe(
      ofType<SaveConversion>(SAVE_CONVERSION),
      map(action => action.payload),
      switchMap(payload =>
        this.service.updateCampaign(payload).pipe(
          switchMap(() => {
            return [new UpdateCampaignSuccess(payload), new ShowSuccessSnackbar(SAVE_SUCCESS)];
          }),
          catchError(error => {
            return observableOf(new UpdateCampaignFailure(`An error occurred. Error code: ${error.status}`));
          })
        )
      )
    )
  );

  updateCampaignStatus = createEffect(() =>
    this.actions$.pipe(
      ofType(UPDATE_CAMPAIGN_STATUS),
      withLatestFrom(this.store$.select('state', 'user', 'data')),
      withLatestFrom(this.store$.select('state', 'advertiser'), ([action, user], state) => {
        const payload = (<UpdateCampaignStatus>action).payload;
        return new Array<[any, CampaignsConfig, Campaign, User]>([
          payload,
          state.campaignsConfig,
          state.campaigns.find(campaign => campaign.id === payload.id),
          user,
        ]);
      }),
      switchMap(([[payload, config, campaign, user]]) => {
        return this.service.updateStatus(payload.id, payload.status).pipe(
          switchMap(() => [new UpdateCampaignStatusSuccess(payload), new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS)]),
          catchError(error => {
            if (error.status === HTTP_INTERNAL_SERVER_ERROR) {
              return [];
            }

            function isCampaignOutdated() {
              return (
                campaign.basicInformation.dateEnd && moment(new Date()) > moment(campaign.basicInformation.dateEnd)
              );
            }

            let errorMsg;
            if (error.status === HTTP_UNPROCESSABLE_ENTITY) {
              const errors = validCampaignBudget(config, campaign, user);

              if (errors.length == 1 && isCampaignOutdated()) {
                this.dialog
                  .open(UserConfirmResponseDialogComponent, {
                    data: {
                      title: 'The campaign is outdated',
                      message:
                        "To make it active you should unset end date or change to a future date.\nDo you want to unset the campaign's end date?",
                    },
                  })
                  .afterClosed()
                  .subscribe(result => {
                    if (result) {
                      this.store$.dispatch(
                        new ActivateOutdatedCampaignStatus({
                          campaignId: payload.id,
                        })
                      );
                    }
                  });

                return [];
              }

              if (errors.length == 0) {
                errors.push('Please check if you have enough money on your account.');
              }
              errorMsg = "We weren't able to activate given campaign.\n" + errors.join('\n');
            } else {
              errorMsg = error.error.errors[0] || error.message;
            }

            return observableOf(new UpdateCampaignFailure(errorMsg));
          })
        );
      })
    )
  );

  activateOutdatedCampaign = createEffect(() =>
    this.actions$.pipe(
      ofType(ACTIVATE_OUTDATED_CAMPAIGN),
      withLatestFrom(this.store$.select('state', 'user', 'data')),
      withLatestFrom(this.store$.select('state', 'advertiser'), ([action, user], state) => {
        const payload = (<ActivateOutdatedCampaignStatus>action).payload;
        return new Array<[any, CampaignsConfig, Campaign, User]>([
          payload,
          state.campaignsConfig,
          state.campaigns.find(campaign => campaign.id === payload.campaignId),
          user,
        ]);
      }),
      switchMap(([[payload, config, campaign, user]]) => {
        return this.service.activateOutdatedCampaign(payload.campaignId).pipe(
          switchMap(() => [
            new ActivateOutdatedCampaignStatusSuccess(payload),
            new ShowSuccessSnackbar(STATUS_SAVE_SUCCESS),
          ]),
          catchError(error => {
            if (error.status === HTTP_INTERNAL_SERVER_ERROR) {
              return [];
            }
            let errorMsg;
            if (error.status === HTTP_UNPROCESSABLE_ENTITY) {
              const errors = validCampaignBudget(config, campaign, user);
              if (errors.length == 0) {
                errors.push('Please check if you have enough money on your account.');
              }
              errorMsg = "We weren't able to activate given campaign.\n" + errors.join('\n');
            } else {
              errorMsg = error.error.errors[0] || error.message;
            }

            return observableOf(new UpdateCampaignFailure(errorMsg));
          })
        );
      })
    )
  );

  cloneCampaign = createEffect(() =>
    this.actions$.pipe(
      ofType<CloneCampaign>(CLONE_CAMPAIGN),
      switchMap(action =>
        this.service.cloneCampaign(action.payload).pipe(
          switchMap(campaign => {
            this.router.navigate(['/advertiser', 'dashboard']);
            return [
              new CloneCampaignSuccess(campaign),
              new AddCampaignToCampaignsSuccess(campaign),
              new ClearLastEditedCampaign(),
            ];
          }),
          catchError(() => {
            return observableOf(
              new CloneCampaignFailure(`Given campaign cannot be cloned at this moment. Please try again later.`)
            );
          })
        )
      )
    )
  );

  deleteCampaign = createEffect(() =>
    this.actions$.pipe(
      ofType<DeleteCampaign>(DELETE_CAMPAIGN),
      map(action => action.payload),
      switchMap(payload =>
        this.service.deleteCampaign(payload).pipe(
          map(() => {
            this.router.navigate(['/advertiser', 'dashboard']);
            return new DeleteCampaignSuccess(payload);
          }),
          catchError(() =>
            observableOf(
              new ShowDialogOnError(`Given campaign cannot be deleted at this moment. Please try again later.`)
            )
          )
        )
      )
    )
  );
}

import { Injectable } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { catchError, map, switchMap, tap } from 'rxjs/operators'

import { CommonService } from 'common/common.service'
import {
  LOAD_INFO,
  LOAD_INFO_FAILURE,
  LOAD_NOTIFICATIONS,
  LoadInfoFailure,
  LoadInfoSuccess,
  LoadNotificationsSuccess,
  REQUEST_REPORT,
  REQUEST_REPORT_FAILURE,
  REQUEST_REPORT_SUCCESS,
  RequestReport,
  RequestReportFailure,
  RequestReportSuccess,
  SHOW_DIALOG_ON_ERROR,
  SHOW_SUCCESS_SNACKBAR,
  ShowDialogOnError,
  ShowSuccessSnackbar,
} from './common.actions'
import {
  ADD_CAMPAIGN_TO_CAMPAIGNS_FAILURE,
  AddCampaignToCampaignsFailure,
  DELETE_CAMPAIGN_FAILURE,
  DeleteCampaignFailure,
  UPDATE_CAMPAIGN_FAILURE,
  UpdateCampaignFailure,
} from 'store/advertiser/advertiser.actions'
import { ADD_SITE_TO_SITES_FAILURE, AddSiteToSitesFailure } from 'store/publisher/publisher.actions'
import {
  GET_PRIVACY_SETTINGS_FAILURE,
  GET_REJECTED_DOMAINS_FAILURE,
  GET_TERMS_SETTINGS_FAILURE,
  GetPrivacySettingsFailure,
  GetRejectedDomainsFailure,
  GetTermsSettingsFailure,
  SET_ADMIN_SETTINGS_FAILURE,
  SET_REJECTED_DOMAINS_FAILURE,
  SetAdminSettingsFailure,
  SetRejectedDomainsFailure,
} from 'store/admin/admin.actions'
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component'
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component'
import { CANCEL_AWAITING_TRANSACTION_FAILURE, CancelAwaitingTransactionFailure } from 'store/settings/settings.actions'
import {
  UserConfirmResponseDialogComponent
} from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component'
import { of } from 'rxjs'
import { SessionService } from '../../session.service'

@Injectable()
export class CommonEffects {
  constructor (
    private actions$: Actions,
    private router: Router,
    private service: CommonService,
    private session: SessionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  @Effect()
  loadInfo = this.actions$
    .pipe(
      ofType(LOAD_INFO),
      switchMap(() => this.service.getInfo()
        .pipe(
          map(info => new LoadInfoSuccess(info)),
          catchError(error => of(new LoadInfoFailure(error.message)))
        )
      )
    )

  @Effect()
  loadNotifications = this.actions$
    .pipe(
      ofType(LOAD_NOTIFICATIONS),
      switchMap(() => this.service.getNotifications()),
      map(notifications => new LoadNotificationsSuccess(notifications))
    )

  @Effect({ dispatch: false })
  handleErrors = this.actions$
    .pipe(
      ofType<LoadInfoFailure |
        ShowDialogOnError |
        UpdateCampaignFailure |
        DeleteCampaignFailure |
        AddCampaignToCampaignsFailure |
        AddSiteToSitesFailure |
        SetAdminSettingsFailure |
        GetPrivacySettingsFailure |
        GetTermsSettingsFailure |
        GetRejectedDomainsFailure |
        SetRejectedDomainsFailure |
        CancelAwaitingTransactionFailure |
        RequestReportFailure>(
        LOAD_INFO_FAILURE,
        SHOW_DIALOG_ON_ERROR,
        UPDATE_CAMPAIGN_FAILURE,
        DELETE_CAMPAIGN_FAILURE,
        ADD_CAMPAIGN_TO_CAMPAIGNS_FAILURE,
        ADD_SITE_TO_SITES_FAILURE,
        SET_ADMIN_SETTINGS_FAILURE,
        GET_PRIVACY_SETTINGS_FAILURE,
        GET_TERMS_SETTINGS_FAILURE,
        GET_REJECTED_DOMAINS_FAILURE,
        SET_REJECTED_DOMAINS_FAILURE,
        CANCEL_AWAITING_TRANSACTION_FAILURE,
        REQUEST_REPORT_FAILURE,
      ),
      tap(action => {
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            title: `Error occurred`,
            message: `${action.payload}`,
          }
        })
      })
    )

  @Effect({ dispatch: false })
  handleSuccessActions = this.actions$
    .pipe(
      ofType<ShowSuccessSnackbar>(SHOW_SUCCESS_SNACKBAR),
      tap(action => {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: `${action.payload}`,
          duration: 500,
        })
      })
    )

  @Effect()
  requestReport = this.actions$
    .pipe(
      ofType<RequestReport>(REQUEST_REPORT),
      map(action => action.payload),
      switchMap(payload => this.service.report(payload.type, payload.dateStart, payload.dateEnd, payload.id)
        .pipe(
          map(() => new RequestReportSuccess()),
          catchError(() => {
              return of(
                new RequestReportFailure('Report cannot be generated at this moment. Please try again later.')
              )
            }
          )
        )
      )
    )

  @Effect({ dispatch: false })
  requestReportSuccess = this.actions$
    .pipe(
      ofType<RequestReportSuccess>(REQUEST_REPORT_SUCCESS),
      tap(() => {
        if (this.session.isAdmin() && !this.session.isImpersonated()) {
          return
        }

        this.dialog.open(UserConfirmResponseDialogComponent, {
          data: {
            message: 'Report is being prepared. You can download it from <strong>the Report section</strong>' +
              '<br />' +
              'Do you want to go to <strong>the Report section</strong>?',
          }
        })
          .afterClosed()
          .subscribe(result => result && this.router.navigateByUrl('/settings/reports'))
      })
    )
}

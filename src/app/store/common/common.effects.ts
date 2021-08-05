import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { CommonService } from 'common/common.service';
import {
  LOAD_INFO, LOAD_INFO_FAILURE,
  LOAD_NOTIFICATIONS, LoadInfoFailure, LoadInfoSuccess,
  LoadNotificationsSuccess,
  REQUEST_REPORT,
  REQUEST_REPORT_FAILURE,
  REQUEST_REPORT_SUCCESS,
  RequestReportFailure,
  RequestReportSuccess,
  SHOW_DIALOG_ON_ERROR,
  SHOW_SUCCESS_SNACKBAR,
} from './common.actions';
import {
  DELETE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_FAILURE,
} from 'store/advertiser/advertiser.actions';
import { ADD_SITE_TO_SITES_FAILURE, } from 'store/publisher/publisher.actions';
import {
  GET_PRIVACY_SETTINGS_FAILURE,
  GET_REJECTED_DOMAINS_FAILURE,
  GET_TERMS_SETTINGS_FAILURE,
  SET_ADMIN_SETTINGS_FAILURE,
  SET_REJECTED_DOMAINS_FAILURE,
} from 'store/admin/admin.actions';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component';
import { CANCEL_AWAITING_TRANSACTION_FAILURE } from 'store/settings/settings.actions';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../session.service';

@Injectable()
export class CommonEffects {
  constructor(
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
    .ofType(LOAD_INFO)
    .map(toPayload)
    .switchMap(() => this.service.getInfo()
      .map((info) => new LoadInfoSuccess(info))
      .catch((err) =>  Observable.of(new LoadInfoFailure(err.message)))
    );

  @Effect()
  loadNotifications = this.actions$
    .ofType(LOAD_NOTIFICATIONS)
    .switchMap(() => this.service.getNotifications())
    .map(notifications => new LoadNotificationsSuccess(notifications));

  @Effect({dispatch: false})
  handleErrors = this.actions$
    .ofType(
      LOAD_INFO_FAILURE,
      SHOW_DIALOG_ON_ERROR,
      UPDATE_CAMPAIGN_FAILURE,
      DELETE_CAMPAIGN_FAILURE,
      ADD_SITE_TO_SITES_FAILURE,
      SET_ADMIN_SETTINGS_FAILURE,
      GET_PRIVACY_SETTINGS_FAILURE,
      GET_TERMS_SETTINGS_FAILURE,
      GET_REJECTED_DOMAINS_FAILURE,
      SET_REJECTED_DOMAINS_FAILURE,
      CANCEL_AWAITING_TRANSACTION_FAILURE,
      REQUEST_REPORT_FAILURE,
    )
    .map(toPayload)
    .do(payload => {
      this.dialog.open(ErrorResponseDialogComponent, {
        data: {
          title: `Error occurred`,
          message: `${payload}`,
        }
      });
    });

  @Effect({dispatch: false})
  handleSuccessActions = this.actions$
    .ofType(
      SHOW_SUCCESS_SNACKBAR,
    )
    .map(toPayload)
    .do((payload) => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        data: `${payload}`,
        duration: 500,
      });
    });

  @Effect()
  requestReport = this.actions$
    .ofType(REQUEST_REPORT)
    .map(toPayload)
    .switchMap(payload => this.service.report(payload.type, payload.dateStart, payload.dateEnd, payload.id)
      .map(() => new RequestReportSuccess())
      .catch(() => {
          return Observable.of(
            new RequestReportFailure('Report cannot be generated at this moment. Please try again later.')
          );
        }
      )
    );

  @Effect({dispatch: false})
  requestReportSuccess = this.actions$
    .ofType(
      REQUEST_REPORT_SUCCESS,
    )
    .map(toPayload)
    .do(() => {
      if (this.session.isAdmin()) {
        return;
      }

      this.dialog.open(UserConfirmResponseDialogComponent, {
        data: {
          message: 'Report is being prepared. You can download it from <strong>the Report section</strong>'+
            '<br />'+
            'Do you want to go to <strong>the Report section</strong>?',
        }
      })
        .afterClosed()
        .subscribe(result => result && this.router.navigateByUrl('/settings/reports'));
    });
}

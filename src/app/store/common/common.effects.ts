import { Injectable } from '@angular/core'
import { MatDialog, MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { Actions, Effect, ofType } from '@ngrx/effects'
import { of as observableOf } from 'rxjs'
import { catchError, map, switchMap, tap } from 'rxjs/operators'

import { CommonService } from 'common/common.service'
import {
  LOAD_INFO,
  LoadInfoSuccess,
  REQUEST_REPORT,
  REQUEST_REPORT_SUCCESS,
  RequestReport,
  RequestReportSuccess,
  SHOW_DIALOG_ON_ERROR,
  SHOW_SUCCESS_SNACKBAR,
  ShowDialogOnError,
  ShowSuccessSnackbar,
} from './common.actions'
import {
  UPDATE_CAMPAIGN_FAILURE,
  UpdateCampaignFailure,
} from 'store/advertiser/advertiser.actions'
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component'
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component'
import {
  UserConfirmResponseDialogComponent
} from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component'
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
          catchError(error => observableOf(new ShowDialogOnError(error.message)))
        )
      )
    )

  @Effect({ dispatch: false })
  handleErrors = this.actions$
    .pipe(
      ofType<ShowDialogOnError |
        UpdateCampaignFailure>(
        SHOW_DIALOG_ON_ERROR,
        UPDATE_CAMPAIGN_FAILURE,
      ),
      tap(action => {
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            title: 'Error occurred',
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
          catchError(
            () => observableOf(
              new ShowDialogOnError('Report cannot be generated at this moment. Please try again later.')
            )
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

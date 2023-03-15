import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CommonService } from 'common/common.service';
import {
  LOAD_INFO,
  LoadInfoSuccess,
  LoadPlaceholdersSuccess,
  REQUEST_REPORT,
  REQUEST_REPORT_SUCCESS,
  RequestReport,
  RequestReportSuccess,
  SHOW_DIALOG_ON_ERROR,
  SHOW_SUCCESS_SNACKBAR,
  ShowDialogOnError,
  ShowSuccessSnackbar,
} from './common.actions';
import { UPDATE_CAMPAIGN_FAILURE, UpdateCampaignFailure } from 'store/advertiser/advertiser.actions';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { SuccessSnackbarComponent } from 'common/dialog/success-snackbar/success-snackbar.component';
import { UserConfirmResponseDialogComponent } from 'common/dialog/user-confirm-response-dialog/user-confirm-response-dialog.component';
import { HTTP_SERVICE_UNAVAILABLE } from 'common/utilities/codes';
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
  ) {}

  loadInfo = createEffect(() =>
    this.actions$.pipe(
      ofType(LOAD_INFO),
      switchMap(() =>
        forkJoin({
          info: this.service.getInfo(),
          placeholders: this.service.getLoginPlaceholders(),
        }).pipe(
          switchMap(result => [new LoadInfoSuccess(result.info), new LoadPlaceholdersSuccess(result.placeholders)]),
          catchError(error => {
            if (HTTP_SERVICE_UNAVAILABLE === error.status) {
              return [];
            }
            return observableOf(new ShowDialogOnError(error.message));
          })
        )
      )
    )
  );

  handleErrors = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ShowDialogOnError | UpdateCampaignFailure>(SHOW_DIALOG_ON_ERROR, UPDATE_CAMPAIGN_FAILURE),
        tap(action => {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: 'Error occurred',
              message: `${action.payload}`,
            },
          });
        })
      ),
    { dispatch: false }
  );

  handleSuccessActions = createEffect(
    () =>
      this.actions$.pipe(
        ofType<ShowSuccessSnackbar>(SHOW_SUCCESS_SNACKBAR),
        tap(action => {
          this.snackBar.openFromComponent(SuccessSnackbarComponent, {
            data: `${action.payload}`,
            duration: 500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        })
      ),
    { dispatch: false }
  );

  requestReport = createEffect(() =>
    this.actions$.pipe(
      ofType<RequestReport>(REQUEST_REPORT),
      map(action => action.payload),
      switchMap(payload =>
        this.service.report(payload.type, payload.dateStart, payload.dateEnd, payload.id).pipe(
          map(() => new RequestReportSuccess()),
          catchError(() =>
            observableOf(new ShowDialogOnError('Report cannot be generated at this moment. Please try again later.'))
          )
        )
      )
    )
  );

  requestReportSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType<RequestReportSuccess>(REQUEST_REPORT_SUCCESS),
        tap(() => {
          if (this.session.isAdmin() && !this.session.isImpersonated()) {
            return;
          }

          this.dialog
            .open(UserConfirmResponseDialogComponent, {
              data: {
                message:
                  'Report is being prepared. You can download it from <strong>the Report section</strong>' +
                  '<br />' +
                  'Do you want to go to <strong>the Report section</strong>?',
              },
            })
            .afterClosed()
            .subscribe(result => result && this.router.navigateByUrl('/settings/reports'));
        })
      ),
    { dispatch: false }
  );
}

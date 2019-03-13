import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';

import { CommonService } from 'common/common.service';
import * as commonActions from './common.actions';
import * as advertiserActions from "store/advertiser/advertiser.actions";
import * as publisherActions from "store/publisher/publisher.actions";
import * as adminActions from "store/admin/admin.actions";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SuccessSnackbarComponent } from "common/dialog/success-snackbar/success-snackbar.component";

@Injectable()
export class CommonEffects {
  constructor(
    private actions$: Actions,
    private service: CommonService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  @Effect()
  loadNotifications = this.actions$
    .ofType(commonActions.LOAD_NOTIFICATIONS)
    .switchMap(() => this.service.getNotifications())
    .map(notifications => new commonActions.LoadNotificationsSuccess(notifications));

  @Effect({dispatch: false})
  handleErrors = this.actions$
    .ofType(
      advertiserActions.UPDATE_CAMPAIGN_STATUS_FAILURE,
      advertiserActions.DELETE_CAMPAIGN_FAILURE,
      advertiserActions.DELETE_CAMPAIGN_FAILURE,
      publisherActions.ADD_SITE_TO_SITES_FAILURE,
      adminActions.SET_ADMIN_SETTINGS_FAILURE,

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
  handleSaveSuccess = this.actions$
    .ofType(
      adminActions.SET_ADMIN_SETTINGS_SUCCESS,
    )
    .do(()=> {
      this.snackBar.openFromComponent(SuccessSnackbarComponent ,{
        duration: 500,
      });
    });
}

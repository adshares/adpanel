import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { CommonService } from 'common/common.service';
import {
  LOAD_NOTIFICATIONS,
  LoadNotificationsSuccess,
  SHOW_DIALOG_ON_ERROR,
  SHOW_SUCCESS_SNACKBAR,
} from './common.actions';
import {
  UPDATE_CAMPAIGN_STATUS_FAILURE,
  DELETE_CAMPAIGN_FAILURE,
  UPDATE_CAMPAIGN_FAILURE,
} from "store/advertiser/advertiser.actions";
import {
  ADD_SITE_TO_SITES_FAILURE,
} from "store/publisher/publisher.actions";
import {
  GET_PRIVACY_SETTINGS_FAILURE,
  GET_TERMS_SETTINGS_FAILURE,
  SET_ADMIN_SETTINGS_FAILURE,
} from "store/admin/admin.actions";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
import { MatDialog, MatSnackBar } from "@angular/material";
import { SuccessSnackbarComponent } from "common/dialog/success-snackbar/success-snackbar.component";
import { CANCEL_AWAITING_TRANSACTION_FAILURE } from "store/settings/settings.actions";

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
    .ofType(LOAD_NOTIFICATIONS)
    .switchMap(() => this.service.getNotifications())
    .map(notifications => new LoadNotificationsSuccess(notifications));

  @Effect({dispatch: false})
  handleErrors = this.actions$
    .ofType(
      SHOW_DIALOG_ON_ERROR,
      UPDATE_CAMPAIGN_STATUS_FAILURE,
      UPDATE_CAMPAIGN_FAILURE,
      DELETE_CAMPAIGN_FAILURE,
      ADD_SITE_TO_SITES_FAILURE,
      SET_ADMIN_SETTINGS_FAILURE,
      GET_PRIVACY_SETTINGS_FAILURE,
      GET_TERMS_SETTINGS_FAILURE,
      CANCEL_AWAITING_TRANSACTION_FAILURE
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
}

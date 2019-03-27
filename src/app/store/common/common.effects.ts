import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { CommonService } from 'common/common.service';
import {
  LOAD_NOTIFICATIONS,
  LoadNotificationsSuccess
} from './common.actions';
import {
  UPDATE_CAMPAIGN_STATUS_FAILURE,
  DELETE_CAMPAIGN_FAILURE,
} from "store/advertiser/advertiser.actions";
import { ADD_SITE_TO_SITES_FAILURE } from "store/publisher/publisher.actions";
import {
  GET_PRIVACY_SETTINGS_FAILURE, GET_TERMS_SETTINGS_FAILURE,
  SET_ADMIN_SETTINGS_FAILURE,
  SET_ADMIN_SETTINGS_SUCCESS, SET_PRIVACY_SETTINGS, SET_TERMS_SETTINGS
} from "store/admin/admin.actions";
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
    .ofType(LOAD_NOTIFICATIONS)
    .switchMap(() => this.service.getNotifications())
    .map(notifications => new LoadNotificationsSuccess(notifications));

  @Effect({dispatch: false})
  handleErrors = this.actions$
    .ofType(
      UPDATE_CAMPAIGN_STATUS_FAILURE,
      DELETE_CAMPAIGN_FAILURE,
      ADD_SITE_TO_SITES_FAILURE,
      SET_ADMIN_SETTINGS_FAILURE,
      GET_PRIVACY_SETTINGS_FAILURE,
      GET_TERMS_SETTINGS_FAILURE
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
      SET_ADMIN_SETTINGS_SUCCESS,
      SET_PRIVACY_SETTINGS,
      SET_TERMS_SETTINGS
    )
    .do(() => {
      this.snackBar.openFromComponent(SuccessSnackbarComponent, {
        duration: 500,
      });
    });
}

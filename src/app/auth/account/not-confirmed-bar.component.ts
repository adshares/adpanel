import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'app/api/api.service';
import { User } from "models/user.model";

import { ConfirmResponseDialogComponent } from "common/dialog/confirm-response-dialog/confirm-response-dialog.component";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import { HandleSubscription } from 'common/handle-subscription'

@Component({
  selector: 'app-account-not-confirmed-bar',
  templateUrl: './not-confirmed-bar.component.html',
  styleUrls: ['./not-confirmed-bar.component.scss'],
})
export class AccountNotConfirmedBarComponent extends HandleSubscription implements OnInit {
  user: User;
  isConfirmed;
  isEmailConfirmed;
  isAdminConfirmed;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe((user: User) => {
      this.isConfirmed = user.isConfirmed;
      this.isEmailConfirmed = !user.email || user.isEmailConfirmed;
      this.isAdminConfirmed = user.isAdminConfirmed;
    });
    this.subscriptions.push(userDataSubscription);
  }

  resendActivationEmail() {
    this.api.users.emailActivateResend("/auth/email-activation/")
      .subscribe(
        () => {
          this.dialog.open(ConfirmResponseDialogComponent, {
            data: {
              title: 'Email activation',
              message: 'We have just sent you a new email with activation link.\n Please check your incoming messages and activate your email account to get access to all features of the panel.'
            }
          });
        },
        (err) => {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: 'Resend failed',
              message: err.error.errors.message,
            }
          });
        }
      );
  }
}

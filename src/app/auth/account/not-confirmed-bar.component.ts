import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'app/api/api.service';
import { User } from 'models/user.model';

import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-account-not-confirmed-bar',
  templateUrl: './not-confirmed-bar.component.html',
  styleUrls: ['./not-confirmed-bar.component.scss'],
})
export class AccountNotConfirmedBarComponent extends HandleSubscriptionComponent implements OnInit {
  user: User;
  display: boolean;
  isEmailConfirmed: boolean = true;
  isAdminConfirmed: boolean;
  faUser = faUser;

  constructor(private api: ApiService, private dialog: MatDialog, private store: Store<AppState>) {
    super();
  }

  ngOnInit(): void {
    const userDataSubscription = this.store.select('state', 'user', 'data').subscribe((user: User) => {
      if (!user.uuid) {
        return;
      }
      this.isAdminConfirmed = user.isAdminConfirmed;
      this.isEmailConfirmed = user.isEmailConfirmed || !user.email || -1 === user.email.indexOf('@');
      this.display = !this.isAdminConfirmed || !this.isEmailConfirmed;
    });
    this.subscriptions.push(userDataSubscription);
  }

  resendActivationEmail(): void {
    this.api.users.emailActivateResend('/auth/email-activation/').subscribe(
      () => {
        this.dialog.open(ConfirmResponseDialogComponent, {
          data: {
            title: 'Email activation',
            message:
              'We have just sent you a new email with activation link.\n Please check your incoming messages and activate your email account to get access to all features of the panel.',
          },
        });
      },
      err => {
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            title: 'Resend failed',
            message: err.error.errors.message,
          },
        });
      }
    );
  }
}

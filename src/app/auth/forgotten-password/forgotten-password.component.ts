import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'app/api/api.service';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { Info } from 'models/info.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordComponent extends HandleSubscriptionComponent implements OnInit {
  @ViewChild('remindPasswordForm') remindPasswordForm: NgForm;

  registrationMode: string;
  isSendingEmail = false;
  emailDoesntExist = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const infoSubscription = this.store.select('state', 'common', 'info').subscribe((info: Info) => {
      this.registrationMode = info.registrationMode;
    });
    this.subscriptions.push(infoSubscription);
  }

  sendRemindPasswordEmail() {
    if (!this.remindPasswordForm.valid) {
      return;
    }

    const formValues = this.remindPasswordForm.value;
    const uri = '/auth/reset-password/';

    this.isSendingEmail = true;
    this.emailDoesntExist = false;

    this.api.auth.recoveryPost(formValues.email, uri).subscribe(
      () => {
        this.alwaysGoodDialog();
      },
      () => {
        this.isSendingEmail = false;
        this.alwaysGoodDialog();
      },
      () => (this.isSendingEmail = false)
    );
  }

  alwaysGoodDialog() {
    this.dialog.open(ConfirmResponseDialogComponent, {
      data: {
        title: 'Password reset email sent',
        message:
          'You will soon receive message with password reset link if your email is registered in our user database.\n Please check your email account for incoming message.',
      },
    });
  }
}

import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { MatDialog } from "@angular/material/dialog";

import { ApiService } from 'app/api/api.service';
import { appSettings } from 'app-settings';

import { ConfirmResponseDialogComponent } from "common/dialog/confirm-response-dialog/confirm-response-dialog.component";

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordComponent {
  @ViewChild('remindPasswordForm') remindPasswordForm: NgForm;

  isSendingEmail = false;
  emailDoesntExist = false;
  supportEmail = appSettings.SUPPORT_EMAIL;

  constructor(
    private router: Router,
    private api: ApiService,
    private dialog: MatDialog,
  ) {
  }

  sendRemindPasswordEmail() {
    if (!this.remindPasswordForm.valid) {
      return;
    }

    const formValues = this.remindPasswordForm.value;
    const uri = "/auth/reset-password/";

    this.isSendingEmail = true;
    this.emailDoesntExist = false;

    this.api.auth.recoveryPost(formValues.email, uri)
      .subscribe(
        () => {
          this.alwaysGoodDialog();
        },
        (err) => {
          this.isSendingEmail = false;
          this.alwaysGoodDialog();
        },
        () => this.isSendingEmail = false
      );
  }

  alwaysGoodDialog() {
    this.dialog.open(ConfirmResponseDialogComponent, {
      data: {
        title: 'Password reset email sent',
        message: 'You will soon receive message with password reset link if your email is registered in our user database.\n Please check your email account for incoming message.',
      }
    });
  }
}

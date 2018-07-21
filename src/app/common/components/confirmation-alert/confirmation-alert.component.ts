import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/first';

import { AuthService } from 'auth/auth.service';
import { SessionService } from "app/session.service";
import { User } from "models/user.model";

import { MatDialog } from '@angular/material/dialog';

import { EmailActivationResendConfirmDialogComponent } from "common/dialog/email-activation-resend-confirm-dialog/email-activation-resend-confirm-dialog.component";
import { EmailActivationResendFailedConfirmDialogComponent } from "common/dialog/email-activation-resend-failed-confirm-dialog/email-activation-resend-failed-confirm-dialog.component";

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss'],
})
export class ConfirmationAlertComponent implements OnInit {
  user: User;
  isEmailConfirmed;
  constructor(
    private auth: AuthService,
    private session: SessionService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const savedUser = this.session.getUser();
    if (savedUser) {
      this.isEmailConfirmed = savedUser.isEmailConfirmed;
    }
  }

  resendActivationEmail() {
    this.auth.emailActivationResend("/auth/email-activate/").subscribe(() => this.dialog.open(EmailActivationResendConfirmDialogComponent), () => this.dialog.open(EmailActivationResendFailedConfirmDialogComponent));
  }
}

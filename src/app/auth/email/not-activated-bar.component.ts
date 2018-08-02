import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/first';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from 'app/api/api.service';
import { SessionService } from "app/session.service";
import { User } from "models/user.model";

import { ConfirmResponseDialogComponent } from "common/dialog/confirm-response-dialog/confirm-response-dialog.component";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";




@Component({
  selector: 'app-email-not-activated-bar',
  templateUrl: './not-activated-bar.component.html',
  styleUrls: ['./not-activated-bar.component.scss'],
})
export class EmailNotActivatedBarComponent implements OnInit {
  user: User;
  isEmailConfirmed;
  constructor(
    private api: ApiService,
    private session: SessionService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isEmailConfirmed = this.session.getUser().isEmailConfirmed;
  }

  resendActivationEmail() {
    this.api.users.emailActivateResend("/auth/email-activation/")
      .subscribe(
          () => {
            this.dialog.open(ConfirmResponseDialogComponent,{
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

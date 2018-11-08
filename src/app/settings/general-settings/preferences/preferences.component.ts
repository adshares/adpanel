import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'settings/settings.service';
import { HandleSubscription } from 'common/handle-subscription';
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';

import { LocalStorageUser } from "models/user.model";
import { SessionService } from "app/session.service";

import { MatDialog } from '@angular/material/dialog';
import { ConfirmResponseDialogComponent } from "common/dialog/confirm-response-dialog/confirm-response-dialog.component";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent extends HandleSubscription implements OnInit {
  changeEmailForm: FormGroup;
  changeEmailFormSubmitted = false;
  changePasswordForm: FormGroup;
  changePasswordFormSubmitted = false;

  user: LocalStorageUser;

  newPasswordConfirm = new FormControl();
  errorsPasswordChange = false;
  errorEmailChange = false;

  ObjectKeys = Object.keys;
  graceTime = null;

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private session: SessionService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.createForms();
    this.graceTime = true;
    this.user = this.session.getUser();
  }

  createForms() {
    this.changeEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.changePasswordForm = new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  onChangeEmail() {
    this.changeEmailFormSubmitted = true;
    if (!this.changeEmailForm.valid) {
      return;
    }

    this.errorEmailChange = false;

    this.settingsService.changeEmail(
      this.changeEmailForm.get('email').value,
      "/auth/email-change-confirm-old/",
      "/auth/email-change-confirm-new/"
    )
      .subscribe(
        () => {
          this.changeEmailForm.get('email').setValue('');
          this.dialog.open(ConfirmResponseDialogComponent, {
            data: {
              title: 'Changing email is a 2 step process',
              message: 'First you need to verify your request using your current (old) email address.\nPlease check your email and follow instructions to confirm your request'
            }
          });
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 422) {
            this.errorEmailChange = err.error.errors.email;
            return;
          }
          if (err.error.errors.message) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                message: err.error.errors.message,
              }
            });
            return;
          }
          this.dialog.open(ErrorResponseDialogComponent);
        },
        () => {
          this.changeEmailFormSubmitted = false;
        },
      );
  }

  onChangePassword() {
    const currentPassword = this.changePasswordForm.get('currentPassword').value;
    const newPassword = this.changePasswordForm.get('newPassword').value;

    this.changePasswordFormSubmitted = true;

    if (!this.changePasswordForm.valid || (this.newPasswordConfirm.value !== newPassword)) {
      return;
    }
    const user = {
      password_old: currentPassword,
      password_new: newPassword
    };
    const changePasswordSubscription = this.settingsService.changePassword(user, '')
      .subscribe(
        () => {
          this.changePasswordForm.reset();
          this.newPasswordConfirm.setValue('');
          this.dialog.open(ConfirmResponseDialogComponent, {
            data: {
              title: 'Password changed',
              message: 'Your password has been changed as requested'
            }
          });
        },
        (err) => {
          this.errorsPasswordChange = err.error.errors;
        },
        () => this.changePasswordFormSubmitted = false
      );
    this.subscriptions.push(changePasswordSubscription);
  }
}

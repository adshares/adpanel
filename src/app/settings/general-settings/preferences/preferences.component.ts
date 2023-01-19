import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'settings/settings.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { User } from 'models/user.model';
import { SessionService } from 'app/session.service';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent extends HandleSubscriptionComponent implements OnInit {
  changeEmailForm: FormGroup;
  changeEmailFormSubmitted = false;
  changePasswordForm: FormGroup;
  changePasswordFormSubmitted = false;

  user: User;
  isImpersonated: boolean = false;

  newPasswordConfirm = new FormControl();
  errorsPasswordChange = false;
  errorEmailChange = false;

  ObjectKeys = Object.keys;
  graceTime = null;

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private session: SessionService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.graceTime = true;
    this.user = this.session.getUser();
    this.isImpersonated = this.session.isImpersonated();
    this.createForms();
  }

  createForms(): void {
    this.changeEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    const controls = {};
    if (this.user.hasPassword) {
      controls['currentPassword'] = new FormControl('', Validators.required);
    }
    controls['newPassword'] = new FormControl('', [Validators.required, Validators.minLength(8)]);
    this.changePasswordForm = new FormGroup(controls);
  }

  onChangeEmail(): void {
    this.changeEmailFormSubmitted = true;
    if (!this.changeEmailForm.valid) {
      return;
    }

    this.errorEmailChange = false;

    this.settingsService
      .changeEmail(
        this.changeEmailForm.get('email').value,
        '/auth/email-change-confirm-old/',
        '/auth/email-change-confirm-new/'
      )
      .subscribe(
        user => {
          this.changeEmailForm.get('email').setValue('');
          let title;
          let message;

          if (null !== user) {
            this.user = user;
            title = 'Email changed';
            message = 'Your email address has been changed as requested';
          } else if (!this.user.email) {
            title = 'Email changed';
            message =
              'We have sent an activation email message to your account. Email activation is required for full access to adpanel.';
          } else {
            title = 'Changing email is a 2 step process';
            message =
              'First you need to verify your request using your current (old) email address.\nPlease check your email and follow instructions to confirm your request';
          }

          this.dialog.open(ConfirmResponseDialogComponent, {
            data: { title, message },
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
              },
            });
            return;
          }
          this.dialog.open(ErrorResponseDialogComponent);
        },
        () => {
          this.changeEmailFormSubmitted = false;
        }
      );
  }

  onChangePassword(): void {
    const currentPassword = this.changePasswordForm.get('currentPassword')
      ? this.changePasswordForm.get('currentPassword').value
      : null;
    const newPassword = this.changePasswordForm.get('newPassword').value;

    this.errorsPasswordChange = false;
    this.changePasswordFormSubmitted = true;

    if (!this.changePasswordForm.valid || this.newPasswordConfirm.value !== newPassword) {
      return;
    }
    const userPasswords = {
      password_old: currentPassword,
      password_new: newPassword,
    };
    const changePasswordSubscription = this.settingsService
      .changePassword(userPasswords, '/auth/password-confirm/')
      .subscribe(
        user => {
          if (user.id) {
            this.user = user;
          }
          this.changePasswordForm.reset();
          this.newPasswordConfirm.setValue('');
          this.dialog.open(
            ConfirmResponseDialogComponent,
            user.id
              ? {
                  data: {
                    title: 'Password changed',
                    message: 'Your password has been changed as requested',
                  },
                }
              : {
                  data: {
                    title: 'Password change needs confirmation',
                    message: 'Please check your email and follow instructions to confirm your request',
                  },
                }
          );
        },
        err => {
          this.errorsPasswordChange = err.error.errors;
        },
        () => (this.changePasswordFormSubmitted = false)
      );
    this.subscriptions.push(changePasswordSubscription);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SessionService } from 'app/session.service';
import { ApiService } from 'app/api/api.service';

import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { SettingsService } from 'settings/settings.service';

@Component({
  selector: 'app-email-processing',
  template: '',
})
export class EmailProcessingComponent implements OnInit {
  action: string;
  token: any;
  error: boolean = false;

  constructor(
    private api: ApiService,
    private settings: SettingsService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.action = this.route.snapshot.url[0].path;

    this.route.params.subscribe(params => {
      this.token = params['token'];
    });

    // this should not happen
    if (!this.token) {
      this.defaultRedirect();
      this.dialogError('Action stopped', 'Missing Token');
      return;
    }

    switch (this.action) {
      case 'email-activation':
        this.emailActivation();
        return;
      case 'withdrawal-confirmation':
        this.confirmWithdrawal();
        return;
      case 'email-change-confirm-old':
        this.emailChangeConfirmOld();
        return;
      case 'email-change-confirm-new':
        this.emailChangeConfirmNew();
        return;
      case 'password-confirm':
        this.passwordConfirm();
        return;
      case 'connection-confirmation':
        this.confirmConnection();
        return;
    }

    this.defaultRedirect();
    this.dialogError('Action stopped', 'Unknown execution');
  }

  defaultRedirect() {
    const user = this.session.getUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const chooseAccount = this.session.getAccountTypeChoice();
    this.router.navigate(['/' + chooseAccount + '/dashboard']);
  }

  dialogError(title, message) {
    this.dialog.open(ErrorResponseDialogComponent, {
      data: {
        title: title,
        message: message,
      },
    });
  }

  dialogConfirm(title, message) {
    this.dialog.open(ConfirmResponseDialogComponent, {
      data: {
        title: title,
        message: message,
      },
    });
  }

  updateUser(user) {
    let u = this.session.getUser();
    if (!u) {
      return;
    }
    u.isEmailConfirmed = user.isEmailConfirmed;
    u.isAdminConfirmed = user.isAdminConfirmed;
    u.isConfirmed = user.isConfirmed;
    u.email = user.email;
    u.adserverWallet = user.adserverWallet;
    this.session.setUser(u);
  }

  emailActivation() {
    this.api.users.emailActivate(this.token).subscribe(
      user => {
        this.updateUser(user);
        this.defaultRedirect();
        this.dialogConfirm(
          'Email activation complete',
          'Your email has been activated. You have now access to all features of the panel.'
        );
      },
      () => {
        this.defaultRedirect();
        this.dialogError(
          'Email activation failed',
          'Token is outdated or you are already activated. If your email is still not activated please use Resend button from email activation bar.'
        );
      }
    );
  }

  confirmWithdrawal() {
    this.api.users.confirmWithdrawal(this.token).subscribe(
      () => {
        this.router.navigate(['/settings/billing']);
        this.dialogConfirm('Withdrawal confirmed', 'You should see the transaction in your account history.');
      },
      err => {
        this.defaultRedirect();
        this.dialogError('Withdrawal confirmation failed', err.error.message || 'Unknown error');
      }
    );
  }

  emailChangeConfirmOld() {
    this.api.users.emailConfirm1Old(this.token).subscribe(
      () => {
        this.defaultRedirect();
        this.dialogConfirm(
          'Changing email is a 2 step process',
          'Now you need to verify your new email address.\nWe have sent an activation email to your new email address. Please check your incoming messages.'
        );
      },
      err => {
        this.defaultRedirect();
        this.dialogError('Email change process step failed', err.error.message || 'Unknown error');
      }
    );
  }

  emailChangeConfirmNew() {
    this.api.users.emailConfirm2New(this.token).subscribe(
      user => {
        this.updateUser(user);
        this.defaultRedirect();
        this.dialogConfirm('Email change process complete', 'Requested email address is now assigned to your account.');
      },
      err => {
        this.defaultRedirect();
        this.dialogError('Email change process final step failed', err.error.message || 'Unknown error');
      }
    );
  }

  passwordConfirm() {
    this.api.users.passwordConfirm(this.token).subscribe(
      () => {
        this.dialogConfirm('Password change process complete', 'You can log in with new password.');
        this.defaultRedirect();
      },
      error => {
        this.dialogError('Password change failed', error.error.message || 'Unknown error');
        this.defaultRedirect();
      }
    );
  }

  confirmConnection() {
    this.settings.confirmConnectWallet(this.token).subscribe(
      () => {
        this.router.navigate(['/settings/general']);
        this.dialogConfirm('Connection confirmed', 'Your cryptocurrency wallet has been successfully connected.');
      },
      err => {
        let error = err.error.message || 'Unknown error';
        if (err.error.errors) {
          const key = Object.keys(err.error.errors)[0];
          error = err.error.errors[key][0];
        }
        this.defaultRedirect();
        this.dialogError('Connection confirmation failed', error);
      }
    );
  }
}

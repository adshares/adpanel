import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

import { SessionService } from "app/session.service";
import { ApiService } from 'app/api/api.service';

import { ConfirmResponseDialogComponent } from "common/dialog/confirm-response-dialog/confirm-response-dialog.component";
import { ErrorResponseDialogComponent } from "common/dialog/error-response-dialog/error-response-dialog.component";

@Component({
  selector: 'app-email-processing',
  template: '',
})

export class EmailProcessingComponent {
  action: string;
  token: any;
  ObjectKeys = Object.keys;
  error: boolean = false;

  constructor(
    private api: ApiService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

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
      }
    });
  }

  dialogConfirm(title, message) {
    this.dialog.open(ConfirmResponseDialogComponent, {
      data: {
        title: title,
        message: message,
      }
    });
  }

  updateUserEmail(user) {
    let u = this.session.getUser();
    if (!u) {
      return;
    }
    u.isEmailConfirmed = user.isEmailConfirmed;
    u.isAdminConfirmed = user.isAdminConfirmed;
    u.isConfirmed = user.isConfirmed;
    u.email = user.email;
    this.session.setUser(u);
  }

  emailActivation() {
    this.api.users.emailActivate(this.token)
      .subscribe(
        (user) => {
          this.updateUserEmail(user);
          this.defaultRedirect();
          this.dialogConfirm('Email activation complete', 'Your email has been activated. You have now access to all features of the panel.');
        },
        (err) => {
          this.defaultRedirect();
          this.dialogError('Email activation failed', 'Token is outdated or you are already activated. If your email is still not activated please use Resend button from email activation bar.');
        }
      );
  }

  confirmWithdrawal() {
    this.api.users.confirmWithdrawal(this.token)
      .subscribe(
        (user) => {
          this.router.navigate(['/settings/billing'])
          this.dialogConfirm('Withdrawal confirmed', 'You should see the transaction in your account history.');
        },
        (err) => {
          this.defaultRedirect();
          this.dialogError('Withdrawal confirmation failed', 'Token is invalid.');
        }
      );
  }

  emailChangeConfirmOld() {
    this.api.users.emailConfirm1Old(this.token)
      .subscribe(
        () => {
          this.defaultRedirect();
          this.dialogConfirm('Changing email is a 2 step process', 'Now you need to verify your new email address.\nWe have sent an activation email to your new email address. Please check your incoming messages.');
        },
        (err) => {
          this.defaultRedirect();
          if (err.error.errors.message) {
            this.dialogError('Email change process step failed', err.error.errors.message);
          } else {
            this.dialogError('Email change process step failed', 'Unknown error. Please contact support.');
          }
        }
      );
  }

  emailChangeConfirmNew() {
    this.api.users.emailConfirm2New(this.token)
      .subscribe(
        (user) => {
          this.updateUserEmail(user);
          this.defaultRedirect();
          this.dialogConfirm('Email change process complete', 'Requested email address is now assigned to your account.');
        },
        (err) => {
          this.defaultRedirect();
          if (err.error.errors.message) {
            this.dialogError('Email change process final step failed', err.error.errors.message);
          } else {
            this.dialogError('Email change process final step failed', 'Unknown error. Please contact support.');
          }
        }
      );
  }
}

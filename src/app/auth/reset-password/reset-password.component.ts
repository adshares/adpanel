import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'app/api/api.service';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  token: any;
  @ViewChild('confirmPasswordForm') confirmPasswordForm: NgForm;
  isPasswordConfirm = false;
  confirmErrors = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.api.auth.recoveryGet(this.token).subscribe(
        () => [],
        () => {
          this.router.navigate(['/auth/forgotten-password']);
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: 'Invalid password recovery token',
              message: 'The token is outdated or already used before.\nPlease request new password recovery email.',
            },
          });
        }
      );
    });
  }

  resetPassword() {
    const password = this.confirmPasswordForm.value.password;
    const confirmPassword = this.confirmPasswordForm.value.confirmPassword;

    if (!this.confirmPasswordForm.valid || password !== confirmPassword) {
      return;
    }

    this.isPasswordConfirm = true;
    const user = {
      password_new: this.confirmPasswordForm.value.password,
      token: this.token,
    };
    this.api.users.resetPassword(user, this.token).subscribe(
      () => {
        this.router.navigate(['/auth', 'login']);
        this.dialog.open(ConfirmResponseDialogComponent, {
          data: {
            title: 'Your new password is set',
            message: 'Please use it now to log into Adshares adpanel.',
          },
        });
      },
      err => {
        this.confirmErrors = err.error.errors;
        this.isPasswordConfirm = false;
      }
    );
  }
}

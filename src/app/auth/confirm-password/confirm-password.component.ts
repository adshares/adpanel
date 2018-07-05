import {Component, ViewChild} from '@angular/core';
import { appSettings } from 'app-settings';
import { LocalStorageUser, User } from "models/user.model";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "auth/auth.service";
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent {
  @ViewChild('confirmPasswordForm') confirmPasswordForm: NgForm;
  isPasswordConfirm = false;
  confirmErrors= {};
  constructor(
      private authService: AuthService,
      private router: Router
  ) {
  }
  remindPassword() {
      const uri = '/auth/register-confirm/';
      const password = this.confirmPasswordForm.value.password;
      const confirmPassword = this.confirmPasswordForm.value.confirmPassword;

      if (!this.confirmPasswordForm.valid || password !== confirmPassword) {
          return;
      }

      this.isPasswordConfirm = true;
      const user = <User> {
          password_new: this.confirmPasswordForm.value.password,
          password_recovery_token: "dsaadsdsa"
      };
      const confirmPasswordSubscription = this.authService.resetPassword(
          user, uri
      )
          .subscribe(
              () => this.router.navigate(['/auth', 'confirmation']),
              (err) => {
                  this.confirmErrors = err.error.errors;
                  this.isPasswordConfirm = false;
              }
          );

  }
}

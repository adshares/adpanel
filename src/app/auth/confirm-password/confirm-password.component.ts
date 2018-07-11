import {Component, ViewChild} from '@angular/core';
import { appSettings } from 'app-settings';
import { LocalStorageUser, User } from "models/user.model";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "auth/auth.service";
import { HandleSubscription } from "common/handle-subscription";

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent {
  token: any;
  @ViewChild('confirmPasswordForm') confirmPasswordForm: NgForm;
  isPasswordConfirm = false;
  confirmErrors= {};
  constructor(
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute
  ) {
  }
    ngOnInit() {
        this.route.params.subscribe(params => {
            this.token = params['token'];
            this.authService.checkRecoveryPasswordToken(this.token) .subscribe(
                () => [],
                (err) => {
                    if(err.code = 422){
                        this.router.navigate(['/auth', 'confirm-password-bad-token'])
                    }
                }
            );
        });
    }
  remindPassword() {
      const uri = '/auth/register-confirm/';
      const password = this.confirmPasswordForm.value.password;
      const confirmPassword = this.confirmPasswordForm.value.confirmPassword;

      if (!this.confirmPasswordForm.valid || password !== confirmPassword) {
          return;
      }

      this.isPasswordConfirm = true;
      const user = {
          password_new: this.confirmPasswordForm.value.password,
          token: this.token
      };
      const confirmPasswordSubscription = this.authService.resetPassword(
          user, uri
      )
          .subscribe(
              () => this.router.navigate(['/auth', 'confirm-password-success']),
              (err) => {
                  this.confirmErrors = err.error.errors;
                  this.isPasswordConfirm = false;
              }
          );

  }
}

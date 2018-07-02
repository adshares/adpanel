import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'auth/auth.service'
import { HandleSubscription } from 'common/handle-subscription';
import { appSettings } from 'app-settings';
import { User } from "models/user.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends HandleSubscription {
  @ViewChild('registrationForm') registrationForm: NgForm;
  errorsRegister= {};

  ObjectKeys = Object.keys;
  isRegistering = false;
  privacyPolicyLink = appSettings.PRIVACY_POLICY_LINK;
  user: User;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  register() {
    const password = this.registrationForm.value.password;
    const confirmPassword = this.registrationForm.value.confirmPassword;

    if (!this.registrationForm.valid || password !== confirmPassword) {
      return;
    }

    this.isRegistering = true;
    const user = <User> {
      email:  this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      isAdvertiser: true,
      isPublisher: true
    };
    const registerSubscription = this.authService.registerUser(
        user
    )
      .subscribe(
          () => this.router.navigate(['/auth', 'confirmation']),
      (err) => {
              this.errorsRegister = err.error.errors;
        }
      );

    this.subscriptions.push(registerSubscription);
  }
}

import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'auth/auth.service'
import { HandleSubscription } from 'common/handle-subscription';
import { appSettings } from 'app-settings';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends HandleSubscription {
  @ViewChild('registrationForm') registrationForm: NgForm;

  isRegistering = false;
  privacyPolicyLink = appSettings.PRIVACY_POLICY_LINK;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    super(null);
  }

  register() {
    const password = this.registrationForm.value.password
    const confirmPassword = this.registrationForm.value.confirmPassword

    if (!this.registrationForm.valid || password !== confirmPassword) {
      return;
    }

    this.isRegistering = true;

    const registerSubscription = this.authService.registerUser(
      this.registrationForm.value.email,
      this.registrationForm.value.password
    )
      .subscribe(() => this.router.navigate(['/auth', 'confirmation']));

    this.subscriptions.push(registerSubscription);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'app/api/api.service';
import { HandleSubscription } from 'common/handle-subscription';
import { appSettings } from 'app-settings';
import { User } from 'models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends HandleSubscription implements OnInit {
  @ViewChild('registrationForm') registrationForm: NgForm;

  isRegistering = false;
  privacyPolicyLink = appSettings.PRIVACY_POLICY_LINK;
  termsOfServiceLink = appSettings.TERMS_OF_SERVICE_LINK;
  referralId?: string;
  user: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const referralId = params['r'];

      if (referralId) {
        this.storeReferralId(referralId);
      }
    });
  }

  register() {
    const uri = '/auth/email-activation/';
    const password = this.registrationForm.value.password;
    const confirmPassword = this.registrationForm.value.confirmPassword;

    if (!this.registrationForm.valid || password !== confirmPassword) {
      return;
    }

    this.isRegistering = true;
    let user = <User>{
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      isAdvertiser: false,
      isPublisher: false
    };

    const referralId = this.fetchReferralId();
    if (referralId) {
      user.referralId = referralId;
    }

    const registerSubscription = this.api.users.register(
      user, uri
    )
      .subscribe(
        () => this.router.navigate(['/auth', 'registered']),
        (error: HttpErrorResponse) => {
          this.isRegistering = false;

          if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error ${error.status} during registration`,
                message: `Registering ${user.email} e-mail is not possible. Please, use another one.`,
              }
            });
          }
        }
      );

    this.subscriptions.push(registerSubscription);
  }

  storeReferralId(referralId: string): void {
    this.referralId = referralId;
    this.api.users.setReferralId(referralId);
  }

  fetchReferralId(): string | null {
    return this.referralId || this.api.users.getReferralId();
  }
}

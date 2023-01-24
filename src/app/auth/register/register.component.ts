import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from 'app/api/api.service';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { User } from 'models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } from 'common/utilities/codes';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { AppState } from 'models/app-state.model';
import { Store } from '@ngrx/store';
import { CommonService } from 'common/common.service';
import { of as observableOf, forkJoin as observableForkJoin } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { RefLinkInfo } from 'models/settings.model';
import { Info } from 'models/info.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent extends HandleSubscriptionComponent implements OnInit {
  @ViewChild('registrationForm') registrationForm: NgForm;

  isLoading = true;
  isRegistering = false;
  privacyPolicyLink: string;
  termsOfServiceLink: string;
  user: User;
  registrationEnabled: boolean = false;
  registrationMode: string;
  refLinkInfo: RefLinkInfo;

  constructor(
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private common: CommonService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          return observableForkJoin([
            this.store.select('state', 'common', 'info').pipe(take(1)),
            params['token'] ? this.common.getRefLinkInfo(params['token']) : observableOf(null),
          ]);
        })
      )
      .subscribe(
        (responses: [Info, RefLinkInfo]) => {
          this.privacyPolicyLink = responses[0].privacyUrl;
          this.registrationMode = responses[0].registrationMode;
          this.termsOfServiceLink = responses[0].termsUrl;
          this.refLinkInfo = responses[1];
          if (this.refLinkInfo) {
            this.api.users.setReferralToken(this.refLinkInfo.token);
          }
          if (this.registrationMode === 'private' || (this.registrationMode === 'restricted' && !this.refLinkInfo)) {
            return this.router.navigate(['/403']);
          }
          this.registrationEnabled =
            this.registrationMode === 'public' || (this.refLinkInfo && this.refLinkInfo.status === 'active');
          this.isLoading = false;
        },
        error => {
          if (error.status === HTTP_NOT_FOUND) {
            return this.router.navigate(['/404']);
          } else {
            this.dialog.open(ErrorResponseDialogComponent, {
              data: {
                title: `Error occurred`,
                message: `${error.error ? error.error.message : error}`,
              },
            });
          }
        }
      );
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
      isPublisher: false,
    };

    const referralToken = this.api.users.getReferralToken();
    if (referralToken) {
      user.referralToken = referralToken;
    }

    const registerSubscription = this.api.users.register(user, uri).subscribe(
      () => this.router.navigate(['/auth', 'registered']),
      (error: HttpErrorResponse) => {
        this.isRegistering = false;

        if (error.status !== HTTP_INTERNAL_SERVER_ERROR) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: `Error ${error.status} during registration`,
              message: `Registering ${user.email} e-mail is not possible. Please, use another one.`,
            },
          });
        }
      }
    );

    this.subscriptions.push(registerSubscription);
  }
}

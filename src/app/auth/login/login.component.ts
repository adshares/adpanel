import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import 'rxjs/add/operator/map';

import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';

import { LocalStorageUser, User } from 'models/user.model';
import { AccountChooseDialogComponent } from 'common/dialog/account-choose-dialog/account-choose-dialog.component';
import { HandleSubscription } from 'common/handle-subscription';

import { appSettings } from 'app-settings';
import { isUnixTimePastNow } from 'common/utilities/helpers';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import * as authActions from 'store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends HandleSubscription implements OnInit {
  // @ViewChild('rememberUser') rememberUser: ElementRef;

  loginForm: FormGroup;

  isLoggingIn = false;
  loginFormSubmitted = false;
  criteriaError = false;

  constructor(
    private api: ApiService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    // SMELL: this should be elsewhere anyway (?)
    const user: LocalStorageUser = this.session.getUser();
    if (user) {
      this.router.navigate(['/' + this.session.getAccountTypeChoice(), 'dashboard']);
      return;
    }

    this.storeReferralIdIfPresent();

    this.store.dispatch(new authActions.UserLogOutSuccess());

    this.createForm();
    this.checkIfUserRemembered();
  }

  private storeReferralIdIfPresent() {
    this.route.queryParams.subscribe(params => {
      const referralId = params['r'];

      if (referralId) {
        this.api.users.setReferralId(referralId);
      }
    });
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  checkIfUserRemembered() {
    const userData = JSON.parse(localStorage.getItem('adshUser'));

    if (userData && userData.remember && !isUnixTimePastNow(userData.expiration)) {
      this.loginForm.get('email').setValue(userData.email);
      this.loginForm.get('password').setValue('********');
      // this.rememberUser.nativeElement.checked = true;
    }
  }

  login() {
    this.loginFormSubmitted = true;

    if (!this.loginForm.valid) {
      return;
    }

    this.isLoggingIn = true;

    this.api.auth.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    )
      .subscribe(
        (user: User) => {
          this.processLogin(user);
          if (user.isAdmin) {
            this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADMIN);
            this.router.navigateByUrl(this.route.snapshot.queryParams['redirectUrl'] || '/admin/dashboard');
            return;
          }

          const redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
          if (redirectUrl) {
            if (redirectUrl.includes(SessionService.ACCOUNT_TYPE_ADVERTISER) && user.isAdvertiser) {
              this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADVERTISER);
              this.router.navigateByUrl(redirectUrl);
              return;
            }

            if (redirectUrl.includes(SessionService.ACCOUNT_TYPE_PUBLISHER) && user.isPublisher) {
              this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_PUBLISHER);
              this.router.navigateByUrl(redirectUrl);
              return;
            }
          }

          let accountType = this.session.getAccountTypeChoice();
          if (!accountType || SessionService.ACCOUNT_TYPE_ADMIN === accountType) {
            if (user.isAdvertiser && user.isPublisher) {
              this.dialog.open(AccountChooseDialogComponent, {disableClose: true});
              return;
            }
            if (user.isAdvertiser) {
              accountType = SessionService.ACCOUNT_TYPE_ADVERTISER;
            }
            if (user.isPublisher) {
              accountType = SessionService.ACCOUNT_TYPE_PUBLISHER;
            }
          }

          if (SessionService.ACCOUNT_TYPE_ADVERTISER === accountType && user.isAdvertiser
            || SessionService.ACCOUNT_TYPE_PUBLISHER === accountType && user.isPublisher) {
            this.session.setAccountTypeChoice(accountType);
            this.router.navigateByUrl(`/${accountType}/dashboard`);
          }
        },
        (err) => {
          this.criteriaError = true;
          this.isLoggingIn = false;
        });
  }

  processLogin(user: User) {
    const rememberUser = false;//this.rememberUser.nativeElement.checked;
    const expirationSeconds = rememberUser ?
      appSettings.REMEMBER_USER_EXPIRATION_SECONDS : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS;
    const dataToSave: LocalStorageUser = Object.assign({}, user, {
      remember: rememberUser,
      passwordLength: this.loginForm.get('password').value.length,
      expiration: ((+new Date) / 1000 | 0) + expirationSeconds
    });

    this.store.dispatch(new authActions.UserLogInSuccess(dataToSave));

    this.session.setUser(dataToSave);
  }
}

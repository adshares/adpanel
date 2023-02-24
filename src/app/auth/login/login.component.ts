import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'app/api/api.service';
import { SessionService } from 'app/session.service';
import { LocalStorageUser, User } from 'models/user.model';
import { AccountChooseDialogComponent } from 'common/dialog/account-choose-dialog/account-choose-dialog.component';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { appSettings } from 'app-settings';
import { isUnixTimePastNow } from 'common/utilities/helpers';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import * as authActions from 'store/auth/auth.actions';
import AdsWallet from '@adshares/ads-connector';
import { ADSHARES_WALLET, METAMASK_WALLET } from 'models/enum/link.enum';
import { WalletToken } from 'models/settings.model';
import { stringToHex } from 'web3-utils';
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component';
import { HTTP_FORBIDDEN, HTTP_INTERNAL_SERVER_ERROR } from 'common/utilities/codes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends HandleSubscriptionComponent implements OnInit {
  readonly ADSHARES_WALLET = ADSHARES_WALLET;
  readonly METAMASK_WALLET = METAMASK_WALLET;
  registrationMode: string;
  loginForm: FormGroup;

  isLoggingIn: boolean = false;
  loginFormSubmitted: boolean = false;
  criteriaError = false;

  adsWalletAvailable: boolean = true;
  ethereumAvailable: boolean = true;
  isAdsLoggingIn: boolean = false;
  isBscLoggingIn: boolean = false;
  walletLoginError: string | null;
  advertiserApplyFormUrl: string;
  publisherApplyFormUrl: string;
  private supportEmail: string;

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

  ngOnInit(): void {
    const loginPlaceholdersSubscription = this.store
      .select('state', 'common', 'placeholders')
      .subscribe(placeholders => {
        this.advertiserApplyFormUrl = placeholders?.advertiserApplyFormUrl;
        this.publisherApplyFormUrl = placeholders?.publisherApplyFormUrl;
      });
    this.subscriptions.push(loginPlaceholdersSubscription);
    const infoSubscription = this.store.select('state', 'common', 'info').subscribe(info => {
      this.registrationMode = info.registrationMode;
      this.supportEmail = info.supportEmail;
    });
    this.subscriptions.push(infoSubscription);
    this.createForm();

    const user: LocalStorageUser = this.session.getUser();
    if (user) {
      this.redirectAfterLogin(user);
      return;
    }
    this.checkIfUserRemembered();
    this.redirectIfReferralTokenPresent();
    this.store.dispatch(new authActions.UserLogOutSuccess());
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  checkIfUserRemembered(): void {
    const userData = JSON.parse(localStorage.getItem('adshUser'));

    if (userData && userData.remember && !isUnixTimePastNow(userData.expiration)) {
      this.loginForm.get('email').setValue(userData.email);
      this.loginForm.get('password').setValue('********');
    }
  }

  login(): void {
    this.loginFormSubmitted = true;

    if (!this.loginForm.valid) {
      return;
    }

    this.isLoggingIn = true;

    this.api.auth.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (user: User) => {
        this.processLogin(user);
      },
      res => {
        if (HTTP_FORBIDDEN === res.status) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: 'Your account is locked',
              message: `Info: ${res.error.reason} \n\n In case of doubts, please contact support ${this.supportEmail}`,
            },
          });
          this.isLoggingIn = false;
          return;
        }
        this.criteriaError = true;
        this.isLoggingIn = false;
      }
    );
  }

  redirectAfterLogin(user: User): void {
    if (this.isOauth()) {
      this.oauthRedirect();
      return;
    }
    const redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
    if (user.isAdmin) {
      this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADMIN);
    } else if (user.isModerator) {
      this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_MODERATOR);
    } else if (user.isAgency) {
      this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_AGENCY);
    }
    if (redirectUrl && (user.isAdmin || user.isModerator || user.isAgency)) {
      this.navigateByUrl(redirectUrl);
      return;
    }

    if (redirectUrl) {
      if (redirectUrl.includes(SessionService.ACCOUNT_TYPE_ADVERTISER) && user.isAdvertiser) {
        this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADVERTISER);
        this.navigateByUrl(redirectUrl);
        return;
      }

      if (redirectUrl.includes(SessionService.ACCOUNT_TYPE_PUBLISHER) && user.isPublisher) {
        this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_PUBLISHER);
        this.navigateByUrl(redirectUrl);
        return;
      }
    }

    this.navigateToDashboard(user);
  }

  navigateToDashboard(user: User): void {
    let accountType = this.session.getAccountTypeChoice();

    if (SessionService.ACCOUNT_TYPE_ADMIN === accountType) {
      if (user.isAdmin) {
        this.navigateByUrl('/admin/dashboard');
        return;
      } else {
        accountType = null;
      }
    } else if (SessionService.ACCOUNT_TYPE_MODERATOR === accountType) {
      if (user.isModerator) {
        this.navigateByUrl('/moderator/dashboard');
        return;
      } else {
        accountType = null;
      }
    } else if (SessionService.ACCOUNT_TYPE_AGENCY === accountType) {
      if (user.isAgency) {
        this.navigateByUrl('/agency/dashboard');
        return;
      } else {
        accountType = null;
      }
    }

    if (!accountType) {
      if (user.isAdvertiser && user.isPublisher) {
        this.dialog.open(AccountChooseDialogComponent, { disableClose: true });
        return;
      }
      if (user.isAdvertiser) {
        accountType = SessionService.ACCOUNT_TYPE_ADVERTISER;
      }
      if (user.isPublisher) {
        accountType = SessionService.ACCOUNT_TYPE_PUBLISHER;
      }
    }

    if (
      (SessionService.ACCOUNT_TYPE_ADVERTISER === accountType && user.isAdvertiser) ||
      (SessionService.ACCOUNT_TYPE_PUBLISHER === accountType && user.isPublisher)
    ) {
      this.session.setAccountTypeChoice(accountType);
      this.navigateByUrl(`/${accountType}/dashboard`);
      return;
    }

    this.navigateByUrl(`/settings/general`);
  }

  processLogin(user: User): void {
    const rememberUser = false;
    const expirationSeconds = rememberUser
      ? appSettings.REMEMBER_USER_EXPIRATION_SECONDS
      : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS;
    const dataToSave: LocalStorageUser = {
      ...user,
      remember: rememberUser,
      passwordLength: this.loginForm.get('password').value.length,
      expiration: ((+new Date() / 1000) | 0) + expirationSeconds,
    };
    this.store.dispatch(new authActions.UserLogInSuccess(dataToSave));
    this.session.setUser(dataToSave);
    this.redirectAfterLogin(user);
  }

  private redirectIfReferralTokenPresent(): void {
    this.route.queryParams.subscribe(params => {
      const referralToken = params['r'];
      if (referralToken) {
        this.router.navigate(['ref', referralToken]);
      }
    });
  }

  private navigateByUrl(url: string): void {
    this.router.navigateByUrl(url).catch(e => console.error(e));
  }

  setWalletLoginStatus(submitted: boolean, network: string | null = null, error: string | null = null): void {
    this.walletLoginError = error;
    if (null === network || 'ADS' === network) {
      this.isAdsLoggingIn = submitted;
    }
    if (null === network || 'BSC' === network) {
      this.isBscLoggingIn = submitted;
    }
  }

  initWalletLogin(network: string): void {
    this.setWalletLoginStatus(true, network);
    this.api.auth.initWalletLogin().subscribe(
      token => {
        switch (network) {
          case 'ADS':
            this.walletLoginAds(token);
            break;
          case 'BSC':
            this.walletLoginBsc(token);
            break;
        }
      },
      () => {
        this.setWalletLoginStatus(false, network, 'Unknown error');
      }
    );
  }

  walletLoginAds(token: WalletToken): void {
    const adsWallet = new AdsWallet();
    adsWallet
      .authenticate(token.message)
      .then(response => {
        if (response.status !== 'accepted') {
          this.setWalletLoginStatus(false, 'ADS', 'Connection was rejected');
          return;
        }
        if (response.testnet) {
          this.setWalletLoginStatus(false, 'ADS', 'Testnet is not supported');
          return;
        }
        this.walletLogin('ADS', response.account.address, token.token, response.signature);
      })
      .catch(() => {
        this.adsWalletAvailable = false;
        this.setWalletLoginStatus(false, 'ADS', 'ADS Wallet not installed');
      });
  }

  walletLoginBsc(token: WalletToken): void {
    const ethereum = (window as any).ethereum;
    if (ethereum === undefined) {
      this.ethereumAvailable = false;
      this.setWalletLoginStatus(false, 'BSC', 'Wallet not installed');
      return;
    }
    ethereum.request({ method: 'eth_requestAccounts' }).then(
      accounts => {
        ethereum
          .request({
            method: 'personal_sign',
            params: [stringToHex(token.message), accounts[0]],
          })
          .then(
            result => {
              this.walletLogin('BSC', accounts[0], token.token, result);
            },
            error => {
              this.setWalletLoginStatus(false, 'BSC', error.message);
            }
          );
      },
      error => {
        this.setWalletLoginStatus(false, 'BSC', error.message);
      }
    );
  }

  walletLogin(network: string, address: string, token: string, signature: string): void {
    const referralToken = this.api.users.getReferralToken();
    this.api.auth.walletLogin(network, address, token, signature, referralToken).subscribe(
      user => {
        this.processLogin(user);
      },
      () => {
        this.setWalletLoginStatus(false, network, 'Account or signature is invalid.');
      }
    );
  }

  isOauth(): boolean {
    return undefined !== this.route.snapshot.queryParams.redirect_uri;
  }

  oauthRedirect(): void {
    this.api.auth.oauthAuthorize(this.route.snapshot.queryParams.redirect_uri).subscribe(
      response => (window.location.href = response.location),
      error => {
        if (HTTP_INTERNAL_SERVER_ERROR === error?.status) {
          return;
        }
        this.dialog.open(ErrorResponseDialogComponent, {
          data: {
            title: `Authorization failed`,
            message: `Server respond with an error ${error.status ? error.status : 0}`,
          },
        });
      }
    );
  }
}

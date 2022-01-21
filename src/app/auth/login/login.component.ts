import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import 'rxjs/add/operator/map'
import { ApiService } from 'app/api/api.service'
import { SessionService } from 'app/session.service'
import { LocalStorageUser, User } from 'models/user.model'
import { AccountChooseDialogComponent } from 'common/dialog/account-choose-dialog/account-choose-dialog.component'
import { HandleSubscription } from 'common/handle-subscription'
import { appSettings } from 'app-settings'
import { isUnixTimePastNow } from 'common/utilities/helpers'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import * as authActions from 'store/auth/auth.actions'
import { Info } from 'models/info.model'
import AdsWallet from '@adshares/ads-connector'
import { WalletToken } from 'models/settings.model'
import { stringToHex } from 'web3-utils'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends HandleSubscription implements OnInit {
  registrationMode: string
  loginForm: FormGroup

  isLoggingIn: boolean = false
  loginFormSubmitted: boolean = false
  criteriaError = false

  adsWalletAvailable: boolean = false
  ethereumAvailable: boolean = false
  isAdsLoggingIn: boolean = false
  isBscLoggingIn: boolean = false
  walletLoginError: string | null

  advertiserApplyFormUrl = appSettings.ADVERTISER_APPLY_FORM_URL
  publisherApplyFormUrl = appSettings.PUBLISHER_APPLY_FORM_URL

  constructor (
    private api: ApiService,
    private session: SessionService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>,
  ) {
    super()
  }

  ngOnInit () {
    const infoSubscription = this.store.select('state', 'common', 'info').
      subscribe((info: Info) => {
        this.registrationMode = info.registrationMode
      })
    this.subscriptions.push(infoSubscription)
    this.createForm()
    // SMELL: this should be elsewhere anyway (?)
    const user: LocalStorageUser = this.session.getUser()
    if (user) {
      this.navigateToDashboard(user)
      return
    }
    this.checkIfUserRemembered()
    this.storeReferralTokenIfPresent()
    this.store.dispatch(new authActions.UserLogOutSuccess())

    const adsWallet = new AdsWallet()
    adsWallet.getInfo().then(() => (this.adsWalletAvailable = true))
    this.ethereumAvailable = typeof (window as any).ethereum !== 'undefined'
  }

  createForm () {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    })
  }

  checkIfUserRemembered () {
    const userData = JSON.parse(localStorage.getItem('adshUser'))

    if (userData && userData.remember &&
      !isUnixTimePastNow(userData.expiration)) {
      this.loginForm.get('email').setValue(userData.email)
      this.loginForm.get('password').setValue('********')
    }
  }

  login () {
    this.loginFormSubmitted = true

    if (!this.loginForm.valid) {
      return
    }

    this.isLoggingIn = true

    this.api.auth.login(
      this.loginForm.value.email,
      this.loginForm.value.password,
    ).subscribe(
      (user: User) => {
        this.processLogin(user)
      },
      () => {
        this.criteriaError = true
        this.isLoggingIn = false
      })
  }

  redirectAfterLogin (user: User) {
    const redirectUrl = this.route.snapshot.queryParams['redirectUrl']
    if (user.isAdmin) {
      this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_ADMIN)
    }
    else if (user.isModerator) {
      this.session.setAccountTypeChoice(
        SessionService.ACCOUNT_TYPE_MODERATOR)
    }
    else if (user.isAgency) {
      this.session.setAccountTypeChoice(SessionService.ACCOUNT_TYPE_AGENCY)
    }
    if (redirectUrl &&
      (user.isAdmin || user.isModerator || user.isAgency)) {
      this.navigateByUrl(redirectUrl)
    }

    if (redirectUrl) {
      if (redirectUrl.includes(SessionService.ACCOUNT_TYPE_ADVERTISER) &&
        user.isAdvertiser) {
        this.session.setAccountTypeChoice(
          SessionService.ACCOUNT_TYPE_ADVERTISER)
        this.navigateByUrl(redirectUrl)
        return
      }

      if (redirectUrl.includes(SessionService.ACCOUNT_TYPE_PUBLISHER) &&
        user.isPublisher) {
        this.session.setAccountTypeChoice(
          SessionService.ACCOUNT_TYPE_PUBLISHER)
        this.navigateByUrl(redirectUrl)
        return
      }
    }

    this.navigateToDashboard(user)
  }

  navigateToDashboard (user: User) {
    let accountType = this.session.getAccountTypeChoice()

    if (SessionService.ACCOUNT_TYPE_ADMIN === accountType) {
      if (user.isAdmin) {
        this.navigateByUrl('/admin/dashboard')
        return
      }
      else {
        accountType = null
      }
    }
    else if (SessionService.ACCOUNT_TYPE_MODERATOR === accountType) {
      if (user.isModerator) {
        this.navigateByUrl('/moderator/dashboard')
        return
      }
      else {
        accountType = null
      }
    }
    else if (SessionService.ACCOUNT_TYPE_AGENCY === accountType) {
      if (user.isAgency) {
        this.navigateByUrl('/agency/dashboard')
        return
      }
      else {
        accountType = null
      }
    }

    if (!accountType) {
      if (user.isAdvertiser && user.isPublisher) {
        this.dialog.open(AccountChooseDialogComponent, { disableClose: true })
        return
      }
      if (user.isAdvertiser) {
        accountType = SessionService.ACCOUNT_TYPE_ADVERTISER
      }
      if (user.isPublisher) {
        accountType = SessionService.ACCOUNT_TYPE_PUBLISHER
      }
    }

    if (SessionService.ACCOUNT_TYPE_ADVERTISER === accountType &&
      user.isAdvertiser || SessionService.ACCOUNT_TYPE_PUBLISHER === accountType &&
      user.isPublisher) {
      this.session.setAccountTypeChoice(accountType)
      this.navigateByUrl(`/${accountType}/dashboard`)
    }
  }

  processLogin (user: User) {
    const rememberUser = false//this.rememberUser.nativeElement.checked;
    const expirationSeconds = rememberUser
      ? appSettings.REMEMBER_USER_EXPIRATION_SECONDS
      : appSettings.AUTH_TOKEN_EXPIRATION_SECONDS
    const dataToSave: LocalStorageUser = {
      ...user,
      remember: rememberUser,
      passwordLength: this.loginForm.get('password').value.length,
      expiration: ((+new Date) / 1000 | 0) + expirationSeconds,
    }
    this.store.dispatch(new authActions.UserLogInSuccess(dataToSave))
    this.session.setUser(dataToSave)
    this.redirectAfterLogin(user)
  }

  private storeReferralTokenIfPresent () {
    this.route.queryParams.subscribe(params => {
      const referralToken = params['r']
      if (referralToken) {
        this.router.navigate(['ref', referralToken])
      }
    })
  }

  private navigateByUrl (url: string) {
    this.router.navigateByUrl(url).catch(e => console.error(e))
  }

  setWalletLoginStatus (submitted: boolean, network: string | null = null, error: string | null = null) {
    this.walletLoginError = error
    if (null === network || 'ADS' === network) {
      this.isAdsLoggingIn = submitted
    }
    if (null === network || 'BSC' === network) {
      this.isBscLoggingIn = submitted
    }
  }

  initWalletLogin (network: string) {
    this.setWalletLoginStatus(true, network)
    this.api.auth.initWalletLogin().subscribe(
      token => {
        switch (network) {
          case 'ADS':
            this.walletLoginAds(token)
            break
          case 'BSC':
            this.walletLoginBsc(token)
            break
        }
      }, () => {
        this.setWalletLoginStatus(false, network, 'Unknown error')
      },
    )
  }

  walletLoginAds (token: WalletToken) {
    const adsWallet = new AdsWallet()
    adsWallet.authenticate(token.message).then(response => {
      if (response.status !== 'accepted') {
        this.setWalletLoginStatus(false, 'ADS', 'Connection was rejected')
        return
      }
      if (response.testnet) {
        this.setWalletLoginStatus(false, 'ADS', 'Testnet is not supported')
        return
      }
      this.walletLogin('ADS', response.account.address, token.token, response.signature)
    })
  }

  walletLoginBsc (token: WalletToken) {
    const ethereum = (window as any).ethereum
    ethereum.request({ method: 'eth_requestAccounts' }).then(
      accounts => {
        ethereum.request({
          method: 'personal_sign',
          params: [stringToHex(token.message), accounts[0]],
        }).then(result => {
          this.walletLogin('BSC', accounts[0], token.token, result)
        }, error => {
          this.setWalletLoginStatus(false, 'BSC', error.message)
        })
      },
      error => {
        this.setWalletLoginStatus(false, 'BSC', error.message)
      })
  }

  walletLogin (network: string, address: string, token: string, signature: string) {
    this.api.auth.walletLogin(network, address, token, signature).subscribe(
      user => {
        this.processLogin(user)
      },
      () => {
        this.setWalletLoginStatus(false, network, 'Account or signature is invalid.')
      },
    )
  }
}

import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { ApiService } from 'app/api/api.service'
import { SessionService } from 'app/session.service'
import { HandleSubscription } from 'common/handle-subscription'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import AdsWallet from '@adshares/ads-connector'
import { ADSHARES_WALLET, METAMASK_WALLET } from 'models/enum/link.enum'
import { WalletToken } from 'models/settings.model'
import { stringToHex } from 'web3-utils'
import { ErrorResponseDialogComponent } from 'common/dialog/error-response-dialog/error-response-dialog.component'
import { HTTP_FORBIDDEN } from 'common/utilities/codes'

@Component({
  selector: 'app-oauth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class OAuthLoginComponent extends HandleSubscription implements OnInit {
  readonly ADSHARES_WALLET = ADSHARES_WALLET
  readonly METAMASK_WALLET = METAMASK_WALLET
  registrationMode: string
  loginForm: FormGroup

  isLoggingIn: boolean = false
  loginFormSubmitted: boolean = false
  criteriaError = false

  adsWalletAvailable: boolean = true
  ethereumAvailable: boolean = true
  isAdsLoggingIn: boolean = false
  isBscLoggingIn: boolean = false
  walletLoginError: string | null
  advertiserApplyFormUrl: string
  publisherApplyFormUrl: string
  private supportEmail: string

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

  ngOnInit (): void {
    const loginPlaceholdersSubscription = this.store.select('state', 'common', 'placeholders')
      .subscribe(placeholders => {
        this.advertiserApplyFormUrl = placeholders?.advertiserApplyFormUrl
        this.publisherApplyFormUrl = placeholders?.publisherApplyFormUrl
      })
    this.subscriptions.push(loginPlaceholdersSubscription)
    const infoSubscription = this.store.select('state', 'common', 'info')
      .subscribe(info => {
        this.registrationMode = info.registrationMode
        this.supportEmail = info.supportEmail
      })
    this.subscriptions.push(infoSubscription)
    this.createForm()
  }

  createForm (): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',
        [Validators.required, Validators.minLength(8)]),
    })
  }

  login (): void {
    this.loginFormSubmitted = true

    if (!this.loginForm.valid) {
      return
    }

    this.isLoggingIn = true

    this.api.auth.oauthLogin(
      this.loginForm.value.email,
      this.loginForm.value.password,
    ).subscribe(
      () => this.redirectAfterLogin(),
      (res) => {
        if (res.status === HTTP_FORBIDDEN) {
          this.dialog.open(ErrorResponseDialogComponent, {
            data: {
              title: 'Your account is banned',
              message: `Info: ${res.error.reason} \n\n In case of doubts, please contact support ${this.supportEmail}`,
            }
          })
          this.isLoggingIn = false
          return
        }
        this.criteriaError = true
        this.isLoggingIn = false
      })
  }

  redirectAfterLogin (): void {
    window.location.href = this.route.snapshot.queryParams.redirect_uri
  }

  setWalletLoginStatus (submitted: boolean, network: string | null = null, error: string | null = null): void {
    this.walletLoginError = error
    if (null === network || 'ADS' === network) {
      this.isAdsLoggingIn = submitted
    }
    if (null === network || 'BSC' === network) {
      this.isBscLoggingIn = submitted
    }
  }

  initWalletLogin (network: string): void {
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

  walletLoginAds (token: WalletToken): void {
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
      .catch(() => {
        this.adsWalletAvailable = false
        this.setWalletLoginStatus(false, 'ADS', 'ADS Wallet not installed')
      })
  }

  walletLoginBsc (token: WalletToken): void {
    const ethereum = (window as any).ethereum
    if (ethereum === undefined) {
      this.ethereumAvailable = false
      this.setWalletLoginStatus(false, 'BSC', 'Wallet not installed')
      return
    }
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

  walletLogin (network: string, address: string, token: string, signature: string): void {
    this.api.auth.oauthWalletLogin(network, address, token, signature).subscribe(
      () => {
        this.redirectAfterLogin()
      },
      () => {
        this.setWalletLoginStatus(false, network, 'Account or signature is invalid.')
      },
    )
  }
}

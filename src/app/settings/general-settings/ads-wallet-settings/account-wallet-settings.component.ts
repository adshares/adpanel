import { Component } from '@angular/core'
import AdsWallet from '@adshares/ads-connector'
import { MatDialog } from '@angular/material'
import { UserAdserverWallet } from 'models/user.model'
import { HandleSubscription } from 'common/handle-subscription'
import { Store } from '@ngrx/store'
import { AppState } from 'models/app-state.model'
import { SettingsService } from 'settings/settings.service'
import { WalletToken } from 'models/settings.model'
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component'

@Component({
  selector: 'app-account-wallet-settings',
  templateUrl: './account-wallet-settings.component.html',
  styleUrls: ['./account-wallet-settings.component.scss'],
})
export class AccountWalletSettingsComponent extends HandleSubscription {
  wallet: UserAdserverWallet
  connectError: string | null
  isSubmitted: boolean = false

  constructor (
    private store: Store<AppState>,
    private settingsService: SettingsService,
    private dialog: MatDialog,
  ) {
    super()
  }

  ngOnInit () {
    this.store.select('state', 'user', 'data', 'adserverWallet').take(2).
      subscribe((wallet: UserAdserverWallet) => {
        this.wallet = wallet
      })
  }

  initConnectToWallet (network: string) {
    this.isSubmitted = true
    this.connectError = null
    this.settingsService.initConnectWallet().subscribe(
      (token) => {
        console.debug(token)
        switch (network) {
          case 'ADS':
            this.connectToAds(token)
            break
          case 'BSC':
            this.connectToBsc(token)
            break
        }
      }, (error) => {
        console.error(error)
      },
    )
  }

  connectToAds (token: WalletToken) {
    const adsWallet = new AdsWallet()
    adsWallet.getInfo().then(
      () => {
        adsWallet.authenticate(token.message).then(response => {
          console.debug(response)
          if (response.status !== 'accepted') {
            this.connectError = 'Connection was rejected'
            this.isSubmitted = false
          }
          if (response.testnet) {
            this.connectError = 'Testnet is not supported'
            this.isSubmitted = false
            return
          }
          this.connectToWallet('ADS', response.account.address, token.token,
            response.signature)
        })
      },
      () => {
        window.open('https://adshares.net/wallet', '_blank').focus()
      },
    )
  }

  connectToBsc (token: WalletToken) {
  }

  connectToWallet (
    network: string, address: string, token: string, sign: string) {
    this.settingsService.connectWallet(network, address, token, sign).subscribe(
      (user) => {
        this.wallet = user.adserverWallet
        this.dialog.open(ConfirmResponseDialogComponent, {
          data: {
            title: 'Wallet connected',
            message: `Your account has been connected to ${network} wallet: ${address}`,
          },
        })
      }, (err) => {
        this.connectError = err.error.message
        this.isSubmitted = false
      })
  }
}

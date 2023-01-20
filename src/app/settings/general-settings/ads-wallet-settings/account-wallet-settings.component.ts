import { Component, OnInit } from '@angular/core';
import AdsWallet from '@adshares/ads-connector';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { UserAdserverWallet } from 'models/user.model';
import { HandleSubscriptionComponent } from 'common/handle-subscription.component';
import { Store } from '@ngrx/store';
import { AppState } from 'models/app-state.model';
import { ADSHARES_WALLET, METAMASK_WALLET } from 'models/enum/link.enum';
import { SettingsService } from 'settings/settings.service';
import { WalletToken } from 'models/settings.model';
import { ConfirmResponseDialogComponent } from 'common/dialog/confirm-response-dialog/confirm-response-dialog.component';
import { stringToHex } from 'web3-utils';
import { SessionService } from '../../../session.service';

@Component({
  selector: 'app-account-wallet-settings',
  templateUrl: './account-wallet-settings.component.html',
  styleUrls: ['./account-wallet-settings.component.scss'],
})
export class AccountWalletSettingsComponent extends HandleSubscriptionComponent implements OnInit {
  readonly ADSHARES_WALLET = ADSHARES_WALLET;
  readonly METAMASK_WALLET = METAMASK_WALLET;
  wallet: UserAdserverWallet;
  connectError: string | null;
  isSubmitted: boolean = false;
  adsWalletAvailable: boolean = true;
  ethereumAvailable: boolean = true;
  isImpersonated: boolean = false;
  isModerator: boolean;

  constructor(
    private store: Store<AppState>,
    private settingsService: SettingsService,
    private session: SessionService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select('state', 'user', 'data', 'adserverWallet')
      .pipe(take(2))
      .subscribe((wallet: UserAdserverWallet) => {
        this.wallet = wallet;
      });
    this.isImpersonated = this.session.isImpersonated();
    this.isModerator = this.session.isModerator();
  }

  initConnectToWallet(network: string) {
    this.isSubmitted = true;
    this.connectError = null;
    this.settingsService.initConnectWallet().subscribe(
      token => {
        switch (network) {
          case 'ADS':
            this.connectToAds(token);
            break;
          case 'BSC':
            this.connectToBsc(token);
            break;
        }
      },
      () => {
        this.connectError = 'Unknown error';
        this.isSubmitted = false;
      }
    );
  }

  connectToAds(token: WalletToken) {
    const adsWallet = new AdsWallet();
    adsWallet.getInfo().then(
      () => {
        adsWallet.authenticate(token.message).then(response => {
          if (response.status !== 'accepted') {
            this.connectError = 'Connection was rejected';
            this.isSubmitted = false;
            return;
          }
          if (response.testnet) {
            this.connectError = 'Testnet is not supported';
            this.isSubmitted = false;
            return;
          }
          this.connectToWallet('ADS', response.account.address, token.token, response.signature);
        });
      },
      () => {
        this.adsWalletAvailable = false;
        this.isSubmitted = false;
      }
    );
  }

  async connectToBsc(token: WalletToken) {
    const ethereum = (window as any).ethereum;
    this.ethereumAvailable = typeof ethereum !== 'undefined';
    if (!this.ethereumAvailable) {
      this.isSubmitted = false;
      return;
    }

    await ethereum.request({ method: 'eth_requestAccounts' }).then(
      async accounts => {
        await ethereum
          .request({
            method: 'personal_sign',
            params: [stringToHex(token.message), accounts[0]],
          })
          .then(
            result => {
              this.connectToWallet('BSC', accounts[0], token.token, result);
            },
            error => {
              this.connectError = error.message;
              this.isSubmitted = false;
            }
          );
      },
      error => {
        this.connectError = error.message;
        this.isSubmitted = false;
      }
    );
  }

  connectToWallet(network: string, address: string, token: string, signature: string) {
    this.settingsService.connectWallet(network, address, token, signature).subscribe(
      user => {
        this.isSubmitted = false;
        if (null !== user) {
          this.wallet = user.adserverWallet;
          this.dialog.open(ConfirmResponseDialogComponent, {
            data: {
              title: 'Wallet connected',
              message: `Your account has been connected to ${network} wallet: ${address}`,
            },
          });
        } else {
          this.dialog.open(ConfirmResponseDialogComponent, {
            data: {
              title: 'Confirm connection request',
              message: 'Please check your email and follow instructions to confirm your request',
            },
          });
        }
      },
      err => {
        this.connectError = err.error.message || 'Unknown error';
        if (err.error.errors) {
          const key = Object.keys(err.error.errors)[0];
          this.connectError = err.error.errors[key][0];
        }
        this.isSubmitted = false;
      }
    );
  }
}

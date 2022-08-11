import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HandleSubscription } from 'common/handle-subscription';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { WithdrawFundsDialogComponent } from 'common/dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { appSettings } from 'app-settings';
import { SessionService } from "app/session.service";
import {AppState} from "models/app-state.model";
import {Store} from "@ngrx/store";
import { UserAdserverWallet } from "models/user.model";
import { CODE, CRYPTO } from "common/utilities/consts";
import { take } from 'rxjs/operators'
import { ServerOptionsService } from 'common/server-options.service'

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent extends HandleSubscription implements OnInit {
  getAdsFaqLink = appSettings.GET_ADS_FAQ_LINK;
  withdrawAdsFaqLink = appSettings.WITHDRAW_ADS_FAQ_LINK;
  wallet: UserAdserverWallet;
  crypto: string = CRYPTO;
  code: string = CODE;
  calculateFunds: boolean
  isImpersonated: boolean = false;

  constructor(
    private dialog: MatDialog,
    private serverOptionsService: ServerOptionsService,
    private session: SessionService,
    private store: Store<AppState>
  ) {
    super();
  }

  openAddFundsDialog() {
    this.dialog.open(AddFundsDialogComponent);
  }

  openWithdrawFundsDialog() {
    this.dialog.open(WithdrawFundsDialogComponent);
  }

  ngOnInit(): void {

    const optionsSubscription = this.serverOptionsService.getOptions()
      .pipe(take(1))
      .subscribe(options => {
        this.calculateFunds = options.displayCurrency !== options.appCurrency
      })
    this.subscriptions.push(optionsSubscription)

    const walletSubscription = this.store.select('state', 'user', 'data', 'adserverWallet')
      .subscribe((wallet: UserAdserverWallet) => {
        this.wallet = wallet;
      });
    this.subscriptions.push(walletSubscription)
    this.isImpersonated = this.session.isImpersonated()
  }
}

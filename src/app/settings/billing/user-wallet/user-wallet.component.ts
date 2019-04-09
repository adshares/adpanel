import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HandleSubscription } from 'common/handle-subscription';
import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { WithdrawFundsDialogComponent } from 'common/dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { appSettings } from 'app-settings';
import { SessionService } from "app/session.service";
import {AppState} from "models/app-state.model";
import {Store} from "@ngrx/store";
import { UserWallet } from "models/settings.model";

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent extends HandleSubscription implements OnInit {
  faqLink = appSettings.FAQ_LINK;
  wallet: UserWallet;

  constructor(
    private dialog: MatDialog,
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

  ngOnInit() {
    this.store.select('state', 'user', 'settings', 'wallet')
      .subscribe((wallet: UserWallet) => {
        this.wallet = wallet;
      });
  }
}

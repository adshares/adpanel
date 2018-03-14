import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';

import { AddFundsDialogComponent } from 'common/dialog/add-funds-dialog/add-funds-dialog.component';
import { WithdrawFundsDialogComponent } from 'common/dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { ChangeAddressDialogComponent } from 'common/dialog/change-address-dialog/change-address-dialog.component';
import { ChangeAutomaticWithdrawDialogComponent } from 'common/dialog/change-automatic-withdraw-dialog/change-automatic-withdraw-dialog.component';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { appSettings } from 'app-settings';
import { enumToArray} from 'common/utilities/helpers';
import { withdrawPeriodsEnum} from 'models/enum/withdraw.enum';

import * as moment from 'moment';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent extends HandleSubscription implements OnInit {
  faqLink = appSettings.FAQ_LINK;

  periods = enumToArray(withdrawPeriodsEnum);

  lastPayment: string;
  totalFunds: number;
  totalFundsInCurrency: number;
  userEthAddress: string;
  userAutomaticWithdrawAmount: number;
  userAutomaticWithdrawPeriod: string;

  constructor(
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    super(null);
  }

  openAddFundsDialog() {
    this.dialog.open(AddFundsDialogComponent);
  }

  openWithdrawFundsDialog() {
    this.dialog.open(WithdrawFundsDialogComponent);
  }

  openChangeAddressDialog() {
    this.dialog.open(ChangeAddressDialogComponent);
  }

  openChangeAutomaticWithdrawsDialog() {
    this.dialog.open(ChangeAutomaticWithdrawDialogComponent);
  }

  ngOnInit() {
    const userFinancialInfoSubscription = this.store.select('state', 'user', 'data')
      .subscribe((userData: User) => {
        this.totalFunds = userData.totalFunds;
        this.totalFundsInCurrency = userData.totalFundsInCurrency;
        this.userEthAddress = userData.userEthAddress;
        this.userAutomaticWithdrawPeriod = this.periods[userData.userAutomaticWithdrawPeriod];
        this.userAutomaticWithdrawAmount = userData.userAutomaticWithdrawAmount;
        this.lastPayment = moment(userData.lastPayment).format('DD/MM/YYYY, hh:mma');
      });

    this.subscriptions.push(userFinancialInfoSubscription);
  }
}

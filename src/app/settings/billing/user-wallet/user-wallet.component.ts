import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddFundsDialogComponent } from '../../../common/dialog/add-funds-dialog/add-funds-dialog.component';
import { WithdrawFundsDialogComponent } from '../../../common/dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { ChangeAddressDialogComponent } from '../../../common/dialog/change-address-dialog/change-address-dialog.component';
import { ChangeAutomaticWithdrawDialogComponent } from '../../../common/dialog/change-automatic-withdraw-dialog/change-automatic-withdraw-dialog.component';
import { appSettings } from '../../../../app-settings/app-settings';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent {
  faqLink = appSettings.FAQ_LINK;

  constructor(private dialog: MatDialog) {}

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
  
}

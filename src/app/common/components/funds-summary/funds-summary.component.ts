import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../../models/user.model';
import { HandleSubscription } from '../../handle-subscription';
import { AppState } from '../../../models/app-state.model';

import { MatDialog } from '@angular/material';
import { AddFundsDialogComponent } from '../../dialog/add-funds-dialog/add-funds-dialog.component';
import { WithdrawFundsDialogComponent } from '../../dialog/withdraw-funds-dialog/withdraw-funds-dialog.component';
import { ChangeAddressDialogComponent } from '../../dialog/change-address-dialog/change-address-dialog.component';
import { ChangeAutomaticWithdrawDialogComponent } from '../../dialog/change-automatic-withdraw-dialog/change-automatic-withdraw-dialog.component';

@Component({
  selector: 'app-funds-summary',
  templateUrl: './funds-summary.component.html',
  styleUrls: ['./funds-summary.component.scss'],
})
export class FundsSummaryComponent extends HandleSubscription implements OnInit {
  selectedRole: string;
  userDataState: Store<User>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super(null);

    this.userDataState = this.store.select('state', 'user', 'data');
  }

  ngOnInit() {
    const getUserSubscription = this.userDataState
      .subscribe((userData: User) => this.checkUserRole(userData));
    this.subscriptions.push(getUserSubscription);
  }

  checkUserRole(user: User) {
    if (user.isAdmin) {
      return;
    }

    this.selectedRole = user.isAdvertiser ? 'Advertiser' : 'Publisher';
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
}

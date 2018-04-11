import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss']
})
export class AddFundsDialogComponent extends HandleSubscription implements OnInit {
  isEmailConfirmed = false;

  adsharesEthAddress: string;
  userMemo: string;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const adsharesEthAddressSubscription = this.store.select('state', 'common', 'adsharesEthAddress')
      .subscribe((adsharesEthAddress: string) => {
        this.adsharesEthAddress = adsharesEthAddress;
      });
    this.subscriptions.push(adsharesEthAddressSubscription);

    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe((user: User) => {
        this.userMemo = user.financialData.userMemo;
        this.isEmailConfirmed = user.isEmailConfirmed;
      });
    this.subscriptions.push(userDataSubscription);
  }

}

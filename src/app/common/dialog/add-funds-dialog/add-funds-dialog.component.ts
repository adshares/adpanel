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

  adsharesAddress: string;
  userMemo: string;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private store: Store<AppState>
  ) {
    super();
  }

  ngOnInit() {
    const adsharesAddressSubscription = this.store.select('state', 'common', 'adsharesAddress')
      .subscribe((adsharesAddress: string) => {
        this.adsharesAddress = adsharesAddress;
      });
    this.subscriptions.push(adsharesAddressSubscription);

    const userDataSubscription = this.store.select('state', 'user', 'data')
      .subscribe((user: User) => {
        this.userMemo = user.user.financialData.userMemo;
        this.isEmailConfirmed = user.user.isEmailConfirmed;
      });
    this.subscriptions.push(userDataSubscription);
  }

}

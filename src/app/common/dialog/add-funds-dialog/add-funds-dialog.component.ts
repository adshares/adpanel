import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { CommonService } from 'common/common.service';

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss']
})
export class AddFundsDialogComponent extends HandleSubscription implements OnInit {
  adsharesEthAddress: string;
  userMemo: string;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private store: Store<AppState>,
    private commonService: CommonService
  ) {
    super(null);
  }

  ngOnInit() {
    const adsharesEthAddressSubscription = this.store.select('state', 'common', 'adsharesEthAddress')
      .subscribe((adsharesEthAddress: string) => {
        this.adsharesEthAddress = adsharesEthAddress;
      });
    this.subscriptions.push(adsharesEthAddressSubscription);

    const userMemoSubscription = this.store.select('state', 'user', 'data', 'userMemo')
      .subscribe((userEthAddress: string) => {
        this.userMemo = userEthAddress;
      });
    this.subscriptions.push(userMemoSubscription);
  }

}

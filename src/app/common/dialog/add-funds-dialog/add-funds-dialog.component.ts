import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { SessionService } from "app/session.service";

@Component({
  selector: 'app-add-funds-dialog',
  templateUrl: './add-funds-dialog.component.html',
  styleUrls: ['./add-funds-dialog.component.scss']
})
export class AddFundsDialogComponent extends HandleSubscription implements OnInit {
  isEmailConfirmed = false;

  adsharesAddress: string;
  paymentMemo: string;

  constructor(
    public dialogRef: MatDialogRef<AddFundsDialogComponent>,
    private session: SessionService,
  ) {
    super();
  }

  ngOnInit() {
    this.adsharesAddress = this.session.getAdsharesAddress();
    const user = this.session.getUser();
    this.paymentMemo = user.adserverWallet.paymentMemo;
    this.isEmailConfirmed = user.isEmailConfirmed;
  }

}

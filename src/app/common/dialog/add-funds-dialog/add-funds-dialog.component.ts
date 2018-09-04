import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

import { HandleSubscription } from 'common/handle-subscription';
import { AdsharesAddress } from 'models/settings.model';
import { AppState } from 'models/app-state.model';
import { User } from 'models/user.model';
import { ApiService } from "app/api/api.service";
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
    private api: ApiService,
    private session: SessionService,
  ) {
    super();
  }

  ngOnInit() {

    const user = this.session.getUser();
    this.paymentMemo = user.adserverWallet.paymentMemo;
    this.isEmailConfirmed = user.isEmailConfirmed;

    this.adsharesAddress = this.session.getAdsharesAddress();
    if (this.adsharesAddress) {
      return;
    }

    this.api.config.adsharesAddress()
      .subscribe((data: AdsharesAddress) => {
        this.session.setAdsharesAddress(data.adsharesAddress);
        this.adsharesAddress = data.adsharesAddress;
    });
  }

}

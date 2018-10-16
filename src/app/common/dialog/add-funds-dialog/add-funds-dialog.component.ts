import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { HandleSubscription } from 'common/handle-subscription';
import { DepositInfo } from 'models/settings.model';
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

    this.api.config.depositInfo()
      .subscribe((data: DepositInfo) => {
        this.adsharesAddress = data.address;
        this.paymentMemo = data.message;
      });
  }

}

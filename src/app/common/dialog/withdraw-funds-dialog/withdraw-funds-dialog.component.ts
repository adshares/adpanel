import { Component, OnInit } from '@angular/core';
import { Store} from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { AppState} from 'models/app-state.model';

@Component({
  selector: 'app-withdraw-funds-dialog',
  templateUrl: './withdraw-funds-dialog.component.html',
  styleUrls: ['./withdraw-funds-dialog.component.scss']
})
export class WithdrawFundsDialogComponent extends HandleSubscription implements OnInit {
  withdrawFundsForm: FormGroup;

  userEthAddress: string;
  isFormBeingSubmitted = false;
  withdrawFormSubmitted = false;

  transactionFee: number;
  totalWithdrawAmount: number;
  fundsLeft: number;

  constructor(
    public dialogRef: MatDialogRef<WithdrawFundsDialogComponent>,
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.createForm();

    const userEthAddressSubscription = this.store.select('state', 'user', 'data', 'financialData', 'userEthAddress')
      .subscribe((userEthAddress: string) => {
        this.userEthAddress = userEthAddress;
      });
    this.subscriptions.push(userEthAddressSubscription);
  }

  createForm() {
    this.withdrawFundsForm = new FormGroup({
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(42),
        Validators.maxLength(42)
      ]),
      amount: new FormControl('', [
        Validators.required
      ])
    });
  }

  withdrawFunds() {
    this.withdrawFormSubmitted = true;

    if (!this.withdrawFundsForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService.withdrawFunds(
      this.withdrawFundsForm.value.address,
      this.withdrawFundsForm.value.amount
    )
      .subscribe(() => this.dialogRef.close());

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }
}

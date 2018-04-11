import { Component, OnInit } from '@angular/core';
import { Store} from '@ngrx/store';
import { MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { HandleSubscription } from 'common/handle-subscription';
import { SettingsService } from 'settings/settings.service';
import { AppState} from 'models/app-state.model';
import { UserFinancialData } from 'models/user.model';

import { appSettings } from 'app-settings';

@Component({
  selector: 'app-withdraw-funds-dialog',
  templateUrl: './withdraw-funds-dialog.component.html',
  styleUrls: ['./withdraw-funds-dialog.component.scss']
})
export class WithdrawFundsDialogComponent extends HandleSubscription implements OnInit {
  withdrawFundsForm: FormGroup;

  financialData: UserFinancialData;

  memoInputActive = false;
  isFormBeingSubmitted = false;
  withdrawFormSubmitted = false;

  txFee: number = appSettings.TX_FEE;

  constructor(
    public dialogRef: MatDialogRef<WithdrawFundsDialogComponent>,
    private store: Store<AppState>,
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    const userAddressSubscription = this.store.select('state', 'user', 'data', 'financialData')
      .subscribe((financialData: UserFinancialData) => this.financialData = financialData);
    this.subscriptions.push(userAddressSubscription);

    this.createForm();
  }

  createForm() {
    const pattern = new RegExp('[0-9a-fA-F]{4}-[0-9a-fA-F]{8}-([0-9a-fA-F]{4}|XXXX)', 'i');
    this.withdrawFundsForm = new FormGroup({
      address: new FormControl(this.financialData.userAddress, [
        Validators.required,
        Validators.pattern(appSettings.ADDRESS_REGEXP)
      ]),
      amount: new FormControl('', [Validators.required]),
      memo: new FormControl('', [Validators.maxLength(32)])
    });
  }

  toggleMemoInput(event, state) {
    event.preventDefault();
    this.memoInputActive = state;
  }

  withdrawFunds() {
    this.withdrawFormSubmitted = true;

    if (!this.withdrawFundsForm.valid) {
      return;
    }

    this.isFormBeingSubmitted = true;

    const changeWithdrawAddressSubscription = this.settingsService.withdrawFunds(
      this.withdrawFundsForm.value.address,
      this.withdrawFundsForm.value.amount,
      this.withdrawFundsForm.value.memo
    )
      .subscribe(() => this.dialogRef.close());

    this.subscriptions.push(changeWithdrawAddressSubscription);
  }
}
